// use std::str::FromStr;

// use serde::{Deserialize, Serialize};

// #[derive(Serialize, Deserialize)]
// #[serde(rename_all = "UPPERCASE")]
// pub enum ActiveStateString {
//     Active,
//     Reloading,
//     Inactive,
//     Failed,
//     Activating,
//     Deactivating,
// }

// impl FromStr for ActiveStateString {
//     type Err = SystemdError;
//     fn from_str(s: &str) -> Result<Self, Self::Err> {
//         serde_json::from_str::<ActiveStateString>(s)
//             .map_err(|_| SystemdError::Other("Got invalid active state from dbus".into()))
//     }
// }

// impl ToString for ActiveStateString {
//     fn to_string(&self) -> String {
//         serde_json::to_string(&self).expect("No Serialize?")
//     }
// }
