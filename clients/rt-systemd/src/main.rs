use clap::Parser;
use futures_util::StreamExt;
use systemd::{SystemdError, SystemdWatcher};
use tokio::sync::mpsc;
use tokio_stream::wrappers::ReceiverStream;
use watcher::WatcherState;

mod systemd;

#[derive(Parser)]
#[command(version, about)]
pub struct Args {
    #[arg()]
    service: String,
}

#[tokio::main]
async fn main() {
    let args = Args::parse();

    let (tx, rx) = mpsc::channel::<WatcherState>(10);
    let service = args.service;

    let watcher_task = tokio::task::spawn(async move {
        let mut watcher = SystemdWatcher::new(service.as_str()).await?;
        let mut stream = watcher.properties_stream().await;

        let mut last_seen: Option<WatcherState> = None;

        while let Some(item) = stream.next().await {
            let item = item?;

            if last_seen.as_ref().is_some_and(|e| e == &item) { continue; }
            tx.send(item.clone()).await.expect("Error sending over channel");
            
            last_seen = Some(item.clone());
        }

        Ok(()) as Result<(), SystemdError>
    });

    let stream_task = tokio::task::spawn(async move {
        let mut stream = ReceiverStream::new(rx);

        while let Some(item) = stream.next().await {
            println!("Received state: {:?}", item);
        }
    });

    let _ = tokio::join!(
        watcher_task,
        stream_task
    );

    println!("Hello, world!");
}
