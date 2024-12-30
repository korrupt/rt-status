use heartbeat::Heartbeat;
use reqwest::{Client, StatusCode};
use serde::Serialize;

#[derive(Debug, PartialEq)]
pub enum PublisherError {
    Serde(String),
    Http(String),
}

pub struct Publisher {
    client: Client,
    url: String,
}

impl Publisher {
    pub fn new<T: Into<String>>(url: T) -> Self {
        Publisher {
            client: Client::new(),
            url: url.into(),
        }
    }

    pub async fn publish_heartbeat<T: Serialize>(
        &self,
        body: Heartbeat<T>,
    ) -> Result<(), PublisherError> {
        let body =
            serde_json::to_string(&body).map_err(|e| PublisherError::Serde(e.to_string()))?;

        let response = self
            .client
            .post(self.url.clone())
            .body(body)
            .send()
            .await
            .map_err(|e| PublisherError::Http(e.to_string()))?;

        if !response.status().is_success() {
            return Err(PublisherError::Http(format!(
                "Received code {}",
                response.status().as_u16()
            )));
        }

        Ok(())
    }
}

#[cfg(test)]
pub mod test {
    type Error = Box<dyn std::error::Error>;
    use heartbeat::{Heartbeat, HeartbeatStatus};
    use serde_json::json;

    use crate::Publisher;

    // todo: make better test
    #[tokio::test]
    async fn test_publish_heartbeat() -> Result<(), Error> {
        let url = "http://127.0.0.1:3000/index.html";
        let publisher = Publisher::new(url);

        let metadata = json!({ "test": "test" });
        let heartbeat = Heartbeat::new(HeartbeatStatus::Active, "test".into(), metadata);

        match publisher.publish_heartbeat(heartbeat).await {
            Ok(_) => {
                println!("Success!!!");
            }
            Err(e) => {
                eprint!("{:?}", e);
            }
        }

        assert!(true);

        Ok(())
    }
}
