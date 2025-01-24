use serde::Serialize;

#[derive(Debug, PartialEq, Clone)]
pub enum WatcherState {
    /// uptime
    Active(u64),
    /// exit time, exit code, statustext
    Inactive(Option<u64>, i32, String),
    /// exit time, exit code, statustext
    Failed(Option<u64>, i32, String),
    Restarting,
    Other(String),
    /// exit time
    LostConnection(u64),
}

pub trait Watcher<T: Serialize> {
    // fn heartbeat_stream(&mut self) -> impl StreamExt<Item = Heartbeat<T>> + Unpin;
    fn produce_state_stream(&mut self);
}

fn main() {
    println!("Hello, world!");
}
