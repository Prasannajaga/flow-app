mod bookmark;

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use std::fs::{self, create_dir_all};
use std::io::Write;
use std::path::{Path, PathBuf}; 
#[cfg_attr(mobile, tauri::mobile_entry_point)]
use std::process::Command; 

#[derive(Debug, Serialize, Deserialize)]
struct CmdArg {
    id: String,
    path: String,
    cmd: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct InputData {
    id : String,
    path : Option<String>,
    title: String,
    cmd_args: Vec<CmdArg>,
    expand : Option<bool>,
}
  
const CONFIG_FILE_NAME: &str = "config.flow"; 

#[tauri::command]
async fn config_options(app: AppHandle ,options: Vec<InputData>) -> Result<String, String> {  
     
    let json_data = serde_json::to_string(&options).map_err(|e| e.to_string())?; 
    println!("saved data {}" , json_data.as_str());  

    let base_path: PathBuf = app.path()
    .app_local_data_dir()
    .expect("Failed to open").join("flow-app"); 

    let _result = create_file_and_write_text( &base_path, CONFIG_FILE_NAME , json_data.as_str()); 
    Ok("Sucess".to_owned())
} 

fn create_file_and_write_text<P: AsRef<Path>>(dir: P, filename: &str, content: &str) -> Result<() ,std::io::Error> {
     create_dir_all(&dir)?;
 
    let mut filepath = dir.as_ref().to_path_buf();
    filepath.push(filename);
 
    let mut file = fs::File::create(filepath)?;
    file.write_all(content.as_bytes())?;

    Ok(())
}

#[tauri::command]
async fn get_bookmarks() -> Result<String, String> {
    let d = bookmark::get_browsers_bookmarks();
    d
}

#[tauri::command]
async fn get_config(app : AppHandle) -> Result<Vec<InputData>, String> {
    let path: PathBuf = app
    .path()
    .app_local_data_dir()
    .expect("failed to load applocalData") 
    .join("flow-app")
    .join("config.flow");

    let content = fs::read_to_string(path).map_err(|e| e.to_string())?;

    // Convert JSON back to Vec<InputData>
    let data: Vec<InputData> =
        serde_json::from_str(&content).map_err(|e: serde_json::Error| e.to_string())?;

    Ok(data)
}


#[tauri::command]
async fn open_multiple_cmds(input: Vec<InputData>) {

    for d in input.iter() {


          if d.id.eq("cmd") {
            for arg in &d.cmd_args {
                let mut command = Command::new("cmd");
                command.current_dir(&arg.path);            
                let args =  vec!["/c", "start", "cmd", "/K", arg.cmd.as_str()]; 
                command.args(&args).spawn().expect("Failed to open CMD"); 
            }
          } 
          else {
            for arg in &d.cmd_args {
                
                if !arg.path.is_empty() {
                    
                    let mut _command = Command::new(&arg.path)
                    .arg(arg.cmd.as_str())
                    .spawn()
                    .expect("failed to open the browsers");  
                } 
         
        
             } 
           } 
        
    }
         
}
 
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            open_multiple_cmds,
            config_options,
            get_config,
            get_bookmarks
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
