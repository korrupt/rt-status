use serde::Serialize;

#[derive(Debug, PartialEq, Clone)]
pub enum WatcherInner {
    Active(u64),
    Inactive(Option<u64>, i32, String),
    Failed(Option<u64>, i32, String),
    Activating,
    Deactivating,
    Reloading,
    Other(String),
}

#[derive(Debug, PartialEq, Clone)]
pub enum WatcherState {
    Connected(WatcherInner),
    /// attempt, timeout, error
    Restarting(usize, u64, String),
}

pub trait Watcher<T: Serialize> {
    // fn heartbeat_stream(&mut self) -> impl StreamExt<Item = Heartbeat<T>> + Unpin;
    fn produce_state_stream(&mut self);
}
