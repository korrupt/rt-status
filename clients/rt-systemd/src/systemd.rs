use futures_util::stream::StreamExt;
use zbus::{proxy, zvariant::OwnedObjectPath, Connection};

#[proxy(
    interface = "org.freedesktop.systemd1.Manager",
    default_service = "org.freedesktop.systemd1",
    default_path = "/org/freedesktop/systemd1"
)]
trait SystemdManager {
    fn load_unit(&self, unit: &str) -> zbus::Result<OwnedObjectPath>;
    fn subscribe(&self) -> zbus::Result<()>;
}

#[proxy(interface = "org.freedesktop.systemd1.Unit")]
trait SystemdUnit {
    #[zbus(property)]
    fn active_state(&self) -> zbus::Result<String>;
    #[zbus(property)]
    fn sub_state(&self) -> zbus::Result<String>;
}

enum SystemdError {
    Zbus(zbus::Error),
}

struct SystemdWatcher<'a> {
    unit: SystemdUnitProxy<'a>,
    manager: SystemdManagerProxy<'a>,
}

impl SystemdWatcher<'_> {
    pub async fn new() {}
}

pub async fn load_unit() -> zbus::Result<()> {
    let conn = Connection::system().await?;
    let manager = SystemdManagerProxy::new(&conn).await?;

    let service = manager.load_unit("rust-modbus.service").await?;

    println!("Path: {}", service);

    Ok(())
}

pub async fn properties_changed() -> zbus::Result<()> {
    let conn = Connection::system().await?;
    let manager = SystemdManagerProxy::new(&conn).await?;

    manager.subscribe().await?;

    let props = zbus::fdo::PropertiesProxy::builder(&conn)
        .destination("org.freedesktop.systemd1")?
        .path("/org/freedesktop/systemd1/unit/rust_2dmodbus_2eservice")?
        .build()
        .await?;

    let mut props_changed = props.receive_properties_changed().await?;

    while let Some(signal) = props_changed.next().await {
        let args = signal.args()?;

        for (name, value) in args.changed_properties().iter() {
            println!(
                "{}.{} changed to `{:?}`",
                args.interface_name(),
                name,
                value
            );
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::*;
    use systemd::{load_unit, properties_changed};

    type Error = Box<dyn std::error::Error>;

    #[tokio::test]
    pub async fn test_zbus() -> zbus::Result<()> {
        // properties_changed().await?;

        load_unit().await.unwrap();

        Ok(())
    }
}
