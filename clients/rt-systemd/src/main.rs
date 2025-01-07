use clap::Parser;

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

    systemd::load_unit().await.unwrap();

    println!("Hello, world!");
}
