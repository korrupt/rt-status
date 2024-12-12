mod systemd;

use std::time::Duration;
use clap::Parser;
use dbus::blocking::{stdintf::org_freedesktop_dbus::Properties, Connection};

use systemd::dbus_constants;


#[derive(Parser, Debug)]
struct Args {
    #[arg()]
    target: String,
}


fn main() {
    let args = Args::parse();

    let conn = Connection::new_system().unwrap();

    let proxy = conn.with_proxy(dbus_constants::systemd_service, dbus_constants::systemd_path, Duration::from_secs(2));

    let (path,): (dbus::Path<'static>,) = proxy
        .method_call(dbus_constants::manager, "GetUnit", (args.target,))
        .unwrap();

    println!("Path: {:?}", path);

    let unit_proxy = conn.with_proxy(dbus_constants::systemd_service, path, Duration::from_secs(2));

    let active_state: String = unit_proxy.get(dbus_constants::unit, "ActiveState").unwrap();

    println!("Active state: {}", active_state);

}
