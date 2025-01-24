use clap::Parser;
use futures_util::StreamExt;
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

    let watcher_task =
        tokio::task::spawn(async move { systemd::run(service.clone(), tx, 1).await });

    let stream_task = tokio::task::spawn(async move {
        let mut stream = ReceiverStream::new(rx);

        while let Some(item) = stream.next().await {
            println!("Received state: {:?}", item);
        }

        return Ok(()) as Result<(), ()>;
    });

    let (watcher_result, publisher_result) = tokio::try_join!(watcher_task, stream_task).unwrap();

    if let Err(e) = watcher_result {
        println!("Error: {:?}", e);
    };

    if let Err(e) = publisher_result {
        println!("Error: {:?}", e);
    }

    println!("Hello, world!");
}
