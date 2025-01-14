use std::pin::Pin;
use watcher::WatcherState;

use futures_util::{stream::StreamExt, Stream};
use zbus::{
    fdo::PropertiesProxy,
    proxy,
    zvariant::{OwnedObjectPath, Value},
    Connection,
};

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
    manager: SystemdManagerProxy<'a>,
    properties: PropertiesProxy<'a>,
}

impl SystemdWatcher<'_> {
    pub async fn new<'a>(service: &str) -> Result<SystemdWatcher<'a>, SystemdError> {
        let conn = Connection::system().await?;
        let manager = SystemdManagerProxy::new(&conn).await?;

        manager.subscribe().await?;

        let path = manager.load_unit(service).await?;

        let properties =
            zbus::fdo::PropertiesProxy::new(&conn, "org.freedesktop.systemd1", path.clone())
                .await?;

        let unit = SystemdUnitProxy::new(&conn, path.clone()).await?;

        Ok(SystemdWatcher {
            unit,
            manager,
            properties,
        })
    }
}

impl<'a> SystemdWatcher<'a> {
    pub async fn properties_stream(
        &mut self,
    ) -> Pin<Box<dyn Stream<Item = Result<WatcherState, SystemdError>> + Send + '_>> {
        // Move the streams into the function to avoid borrowing issues
        let active_state_stream = self.unit.receive_active_state_changed().await;
        let active_enter_timestamp_stream =
            self.unit.receive_active_enter_timestamp_changed().await;

        // Combine the streams and process their values
        let combined_stream = active_state_stream.zip(active_enter_timestamp_stream).then(
            |(state, timestamp)| async move {
                // Extract timestamp
                let t = match timestamp.get().await {
                    Ok(Value::U64(t)) => t,
                    _ => return Err(SystemdError::Other("Unexpected timestamp value".into())),
                };

                // Extract state
                let state = match state.get().await {
                    Ok(s) if s.as_str() == "active" => WatcherState::Active(t),
                    Ok(_) => WatcherState::Inactive,
                    Err(e) => return Err(e.into()),
                };

                Ok(state)
            },
        );

        // Box the stream to unify the return type
        Box::pin(combined_stream)
    }
}

#[cfg(test)]
mod tests {

}
