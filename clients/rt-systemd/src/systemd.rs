use serde::{Deserialize, Serialize};
use std::{
    pin::Pin,
    str::FromStr,
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};
use tokio::{
    sync::mpsc::Sender,
    time::{interval, Interval},
};
use tokio_stream::wrappers::IntervalStream;
use watcher::{Watcher, WatcherState};

use futures_util::{join, stream::StreamExt, Stream};
use zbus::{
    proxy,
    zvariant::{OwnedObjectPath, Value},
    Connection,
};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "lowercase")]
pub enum ActiveStateString {
    Active,
    Reloading,
    Inactive,
    Failed,
    Activating,
    Deactivating,
}

impl FromStr for ActiveStateString {
    type Err = SystemdError;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        serde_plain::from_str::<ActiveStateString>(s)
            .map_err(|_| SystemdError::Other("Got invalid active state from dbus".into()))
    }
}

impl ToString for ActiveStateString {
    fn to_string(&self) -> String {
        serde_plain::to_string(&self).expect("No Serialize?")
    }
}

#[proxy(
    interface = "org.freedesktop.systemd1.Manager",
    default_service = "org.freedesktop.systemd1",
    default_path = "/org/freedesktop/systemd1"
)]
trait SystemdManager {
    fn load_unit(&self, unit: &str) -> zbus::Result<OwnedObjectPath>;
    fn subscribe(&self) -> zbus::Result<()>;
}

#[proxy(
    interface = "org.freedesktop.systemd1.Service",
    default_service = "org.freedesktop.systemd1"
)]
trait SystemdService {
    #[zbus(property)]
    /// i32
    fn exec_main_code(&self) -> zbus::Result<zbus::zvariant::Value>;
    #[zbus(property)]
    fn status_text(&self) -> zbus::Result<zbus::zvariant::Value>;
}
#[proxy(
    interface = "org.freedesktop.systemd1.Unit",
    default_service = "org.freedesktop.systemd1"
)]
trait SystemdUnit {
    #[zbus(property)]
    fn active_state(&self) -> zbus::Result<String>;
    #[zbus(property)]
    fn sub_state(&self) -> zbus::Result<String>;
    #[zbus(property)]
    fn active_enter_timestamp(&self) -> zbus::Result<zbus::zvariant::Value>;
    #[zbus(property)]
    fn inactive_enter_timestamp(&self) -> zbus::Result<zbus::zvariant::Value>;
}

#[derive(Debug, Clone)]
pub enum SystemdError {
    Zbus(zbus::Error),
    Other(String),
}

impl From<zbus::Error> for SystemdError {
    fn from(value: zbus::Error) -> Self {
        SystemdError::Zbus(value)
    }
}

pub struct SystemdWatcher<'a> {
    unit: SystemdUnitProxy<'a>,
    service: SystemdServiceProxy<'a>,
    // manager: SystemdManagerProxy<'a>,
    // properties: PropertiesProxy<'a>,
}

impl SystemdWatcher<'_> {
    pub async fn new<'a>(service: &str) -> Result<SystemdWatcher<'a>, SystemdError> {
        let conn = Connection::system().await?;
        let manager = SystemdManagerProxy::new(&conn).await?;

        manager.subscribe().await?;

        let path = manager.load_unit(service).await?;

        let service = SystemdServiceProxy::new(&conn, path.clone()).await?;

        // let properties =
        //     zbus::fdo::PropertiesProxy::new(&conn, "org.freedesktop.systemd1", path.clone())
        //         .await?;

        let unit = SystemdUnitProxy::new(&conn, path.clone()).await?;

        Ok(SystemdWatcher {
            unit,
            service,
            // properties,
        })
    }
}

fn extract_value<'a, T>(value: Value<'a>) -> Result<T, SystemdError>
where
    T: TryFrom<Value<'a>, Error = zbus::zvariant::Error>,
{
    T::try_from(value).map_err(|e| SystemdError::Other(format!("Type error: {}", e.to_string())))
}

impl<'a> SystemdWatcher<'a> {
    /// create a property stream
    pub fn property_stream(
        &self,
        interval: Interval,
    ) -> Pin<
        Box<
            dyn Stream<Item = Result<(ActiveStateString, u64, i32, String), SystemdError>>
                + Send
                + '_,
        >,
    > {
        let interval_stream = IntervalStream::new(interval);

        let result_stream = interval_stream.then(move |_| {
            let unit = self.unit.clone(); // Clone references for async block
            let service = self.service.clone();

            async move {
                let (active_state, active_enter_timestamp, exec_main_code, status_text) = join!(
                    unit.active_state(),
                    unit.active_enter_timestamp(),
                    service.exec_main_code(),
                    service.status_text(),
                );

                Ok((
                    active_state?.parse::<ActiveStateString>()?,
                    extract_value::<u64>(active_enter_timestamp?)?,
                    extract_value::<i32>(exec_main_code?)?,
                    extract_value::<String>(status_text?)?,
                ))
            }
        });

        // Box and return the stream
        Box::pin(result_stream)
    }
}

pub async fn run<M: Into<String>>(
    service: M,
    sender: Sender<WatcherState>,
) -> Result<(), SystemdError> {
    let service = service.into();

    let duration = Duration::from_secs(1);
    let interval = interval(duration);

    let mut tries = 0;

    loop {
        // retur early
        if tries > 3 {}

        let watcher = match SystemdWatcher::new(service.as_str()).await {
            Ok(watcher) => watcher,
            Err(e) => {
                eprintln!("Err: {:?}", e);
                continue;
            }
        };

        let mut stream = watcher.property_stream(interval);

        let mut exit_time = None;
        let mut has_been_active = false;

        while let Some(item) = stream.next().await {
            match item {
                Ok((active_state, uptime, exit_code, status_text)) => match active_state {
                    ActiveStateString::Active => {
                        has_been_active = true;
                        exit_time = None; // reset exit_time

                        let uptime = uptime / 1000 / 1000; // micros -> secs

                        sender.send(WatcherState::Active(uptime)).await.unwrap();
                    }

                    ActiveStateString::Failed | ActiveStateString::Inactive => {
                        let epoch = if has_been_active {
                            exit_time
                                .get_or_insert(SystemTime::now())
                                .duration_since(UNIX_EPOCH)
                                .ok()
                                .map(|duration| duration.as_secs())
                        } else {
                            None
                        };

                        let watcher_state = match active_state {
                            ActiveStateString::Failed => {
                                WatcherState::Failed(epoch, exit_code, status_text)
                            }
                            ActiveStateString::Inactive => {
                                WatcherState::Inactive(epoch, exit_code, status_text)
                            }
                            _ => unreachable!(),
                        };

                        sender.send(watcher_state).await.unwrap();
                    }
                    // ActiveStateString::Reloading
                    // ActiveStateString::Deactivating
                    // | ActiveStateString::Failed
                    // | ActiveStateString::Inactive => sender.send(WatcherState),
                    _ => todo!("finish"),
                },
                Err(e) => {
                    println!("Consumer error: {:?}", e);
                    continue;
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {}
