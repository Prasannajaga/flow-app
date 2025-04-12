use std::fs;
use std::path::{Path, PathBuf};
use serde_json::{Value};
use std::collections::HashMap;
use base64::encode;

fn find_browser_profiles() -> Vec<(String, PathBuf , String)> {
    let local_app_data = std::env::var("LOCALAPPDATA").unwrap_or_default();

    let browsers = vec![
        ("Chrome", "Google\\Chrome\\User Data" , "Google Profile.ico" ),
        ("Brave", "BraveSoftware\\Brave-Browser\\User Data" , "Google Profile.ico"),
        ("Edge", "Microsoft\\Edge\\User Data" , "Edge Profile.ico"),
    ];

    let mut results = Vec::new();

    for (title, relative_path , logo) in browsers {
        let profile_path = Path::new(&local_app_data).join(relative_path);
        if profile_path.exists() { 
            for entry in fs::read_dir(&profile_path).unwrap_or_else(|_| fs::read_dir(".").unwrap()) {

                if let Ok(entry) = entry { 
                    let path = entry.path();   
                    if path.is_dir() && (path.file_name().unwrap() == "Default" || path.file_name().unwrap().to_string_lossy().starts_with("Profile")) {
                        let bookmark_file = path.join("Bookmarks");
                        let logo_file = path.join(logo.to_string());
                        if bookmark_file.exists() {
                            results.push((title.to_string(), bookmark_file , logo_file.to_string_lossy().to_string()));
                        }
                    }
                }
                
            }
        }
    } 

    results
}

fn parse_bookmarks(path: &Path) -> Option<Value> {
    match fs::read_to_string(path) {
        Ok(content) => {
            match serde_json::from_str(&content) {
                Ok(json) => Some(json),
                Err(_) => None,
            }
        },
        Err(_) => None,
    }
}

pub fn get_browsers_bookmarks() ->  Result<String, String>  {
    let bookmarks = find_browser_profiles();
    let mut results: Vec<HashMap<String, Value>> = Vec::new();

    for (title, path , logo_path) in bookmarks {
        if path.extension().map_or(false, |e| e == "sqlite") {
            // Placeholder for Firefox SQLite handling
            continue;
        }

        if let Some(json) = parse_bookmarks(&path) {
            let mut entry = HashMap::new();
            entry.insert("title".to_string(), Value::String(title));
            entry.insert("bookmarks".to_string(), json);

            println!("logo {}" , logo_path);

            let logo_base64 = fs::read(&logo_path)
                .map(|bytes| format!("data:image/x-icon;base64,{}", encode(bytes)))
                .unwrap_or_default();

            entry.insert("logo".to_string(), Value::String(logo_base64));

            results.push(entry);
        }
    }

    // Pretty print result
    serde_json::to_string_pretty(&results).map_err(|e| e.to_string())
}
