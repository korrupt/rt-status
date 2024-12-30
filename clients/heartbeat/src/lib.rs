use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum HeartbeatStatus {
    Active,
    Restarting,
    Stopped,
    Error,
}

#[derive(Serialize, Deserialize)]
pub struct Heartbeat<T>
where
    T: Sized + Serialize,
{
    status: HeartbeatStatus,
    _type: String,
    metadata: T,
}

impl<T> Heartbeat<T>
where
    T: Sized + Serialize,
{
    pub fn new(status: HeartbeatStatus, _type: String, metadata: T) -> Heartbeat<T> {
        Heartbeat {
            status,
            _type,
            metadata,
        }
    }
}

#[cfg(test)]
mod tests {}
