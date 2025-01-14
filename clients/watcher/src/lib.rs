use futures_util::StreamExt;
use heartbeat::Heartbeat;
use serde::Serialize;

#[derive(Debug, PartialEq, Clone)]
pub enum WatcherState {
    Active(u64),
    Inactive,
}

pub enum WatcherError {}

pub trait Watcher<T: Serialize> {
    fn heartbeat_stream(&mut self) -> impl StreamExt<Item = Heartbeat<T>> + Unpin;
}

fn main() {
    println!("Hello, world!");
}
