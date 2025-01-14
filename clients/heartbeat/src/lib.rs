use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct HeartbeatState {
    satus: HeartbeatStatus
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum HeartbeatStatus {
    Active,
    Inactive,
    Failed,
    Activating,
    Deactivating,
    Maintenance,
    Reloading,
    Refreshing,
}

#[derive(Serialize, Deserialize)]
pub struct Heartbeat<T>
where
    T: Sized + Serialize,
{
    text: Option<String>,
    status: HeartbeatStatus,
    _type: String,
    metadata: T,
    uptime: String
}

impl<T> Heartbeat<T>
where
    T: Sized + Serialize,
{
    pub fn new(
        status: HeartbeatStatus,
        _type: String,
        metadata: T,
        text: Option<String>,
        uptime: String,
    ) -> Heartbeat<T> {
        Heartbeat {
            text,
            status,
            _type,
            metadata,
            uptime
        }
    }
}

#[cfg(test)]
mod tests {}
