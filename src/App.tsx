import { useCallback, useEffect, useState } from "react";  
import "./App.css"
import { invoke } from "@tauri-apps/api/core";
import json from "./constants/default.json";
import ExpansionPanel from "./components/autoComplete";  
import BookMarks, { bookMarks } from "./components/bookmarks";


export type flowType = { 
  id : "browsers" | "cmd" | string,
  path ?: string,
  title : string,
  expand ?: boolean,
  cmd_args : Array<arg_type>
}


export type arg_type = {
  id?:String,
  path : string,
  cmd : string
}
 

function App() { 
 
  const [configData , setConfigData ] = useState<flowType[]>(json.data); 
  const [isOpen , setIsOpen] = useState<boolean>(false);
  const [currentTab , setTab] = useState<string>("All");
  const [bookmarksArr , setBookMarks] = useState<bookMarks[]>([])
  const [formData, setFormData] = useState({
    title: '',
    path: '', 
  });

  useEffect(()=>{  
    const read = async () =>{
      const d = await invoke("get_config"); 
      setConfigData(d as flowType[]);    
    } 
    read();  
  } , []); 

  // for updating bookmarks 
  useEffect(()=>{  
    const read = async () =>{ 
      const book = await invoke("get_bookmarks");  
      let data = JSON.parse(book as string);
      setBookMarks(data);  
    }  
    read();  
  } , [currentTab]); 
  
 
  function execute(data : flowType[]){ 
    console.log(data);
    
    invoke("open_multiple_cmds" , { input : data});
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  async function configure_flow(){ 
    let data : flowType[] = [...configData , {
      id : "browsers",
      title : formData.title,
      path : formData.path,
      cmd_args : []
    }];
    setIsOpen(!isOpen);
    setConfigData(data); 
    await invoke("config_options" , {options : data});    
  }

  const updateConfig = useCallback(async (data:flowType[] , content = "SAVE") => { 
    if(content === "SAVE"){
      setConfigData(() => [...data]);  
      await invoke("config_options" , {options : data}); 
    }
    else{
      execute(data);
    }

  }, []);
 
  return (
    <>

      <main className="container-xl min-h-screen primary-layout ">
      
      <header className="flex items-center justify-between p-2">
            <ul className="flex gap-2 items-center"> 
              <li className={`item ${currentTab === "All" && "bg-dark/80 text-white"}`} onClick={() => setTab("All")}>All</li>
              <li className={`item ${currentTab === "BookMarks" && "bg-dark/80 text-white"}`} onClick={() => setTab("BookMarks")}>Bookmarks</li>
            </ul> 
            {currentTab === "All" && 
              <div className="flex gap-2">
                <button className="primary-btn text-sm hover:!text-white hover:!border-white" onClick={() => setIsOpen(!isOpen)}>set browser</button>
                <button className="primary-btn text-sm hover:!text-white hover:!border-white" onClick={() => execute(configData)}>execute</button>
              </div>
            }
      </header>

        <section className="w-full"  >
          {
            currentTab === "All" ? 
            <ExpansionPanel config_data={configData}  updateCallbckFn={updateConfig} ></ExpansionPanel>  :
            <BookMarks bookmarks={bookmarksArr}></BookMarks> 
          } 
        </section>
 
      </main>


      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
            <header className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4">Set Browser</h2>
              <span onClick={() => setIsOpen(false)} className="text-2xl cursor-pointer">&times;</span>
            </header> 
            <section className="space-y-4">
            <input
                type="text"
                placeholder="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="absoulte path"
                name="path"
                value={formData.path}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              /> 
            </section>
            <div className="mt-6 flex justify-end">
              <button
                className="primary-btn" onClick={configure_flow}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      

    </>
  )
}

export default App;
