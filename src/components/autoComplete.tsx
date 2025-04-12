import { BaseSyntheticEvent, useEffect, useState } from "react";
import { arg_type, flowType } from "../App"; 


type panelProps =  {
  updateCallbckFn: Function,
  config_data : flowType[]
} 


export default function ExpansionPanel({ updateCallbckFn, config_data }: panelProps) { 
  const [fields, setFields] = useState<flowType[]>([]);
  
  useEffect(()=>{ 
    setFields(config_data); 
  } , [config_data])

  // Handle input change
  const handleChange = (Pindex: number, index :number, key : "path" | "cmd" ,  value: string) => {
    const updatedFields = fields[Pindex].cmd_args;
    updatedFields[index][key] = value;
    setFields([...fields]);  
    updateCallbckFn(fields);
  };

  const onExpand = (Pindex: number ,  value: boolean) => {
    const updatedFields = fields[Pindex];
    updatedFields.expand = value; 
    setFields([...fields]);  
  };

  // Add new field
  const addField = (e: BaseSyntheticEvent , index:number ) => {
    let conf  = fields[index];
    conf['cmd_args'].push({id: conf.title === "Cmd" ? "shell" : "web" , path : conf['path'] ??  '' , cmd : "" ,}); 
    setFields([...fields]); 
    e.stopPropagation(); 
  };

  // Remove a field
  const removeField = (Pindex : number , index: number) => {
    const updatedFields = fields[Pindex];
    updatedFields.cmd_args = updatedFields.cmd_args.filter((_: any, i: any) => i !== index); 
    setFields([...fields]);
  };

  const onRun = (PIndex : number) =>{ 
    updateCallbckFn([fields[PIndex]] , "UPDATE");
  }

  return (
    <>
       <div  className="w-full p-4 px-0 overflow-hidden cursor-pointer transition-all">
        {
          fields.length > 0 &&
          fields.map(({title , cmd_args  , expand , id} : flowType, Pindex) => (
              <section className="border-y shadow-sm" key={Pindex} onClick={() => onExpand(Pindex,!expand)}>
                {/* Card Header */}
                <div className="flex justify-between p-5">
                  <h2 className="text-xl">{title}</h2>
                  <div className="flex justify-center items-center">
                  <div className="primary-btn flex items-center text-white !p-[6px] rounded mr-2" onClick={(e)=> {e.stopPropagation(), onRun(Pindex)}}> 
                    <svg className="fill-white  " width="15" height="15" viewBox="0 0 16 16" fill="black">
                      <path d="M4 2L12 8L4 14V2Z"/>
                     </svg>
                  </div> 
                  <svg
                    className={`w-7 h-7 transform transition-transform ${expand ? "rotate-180" : "rotate-0"
                      }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  </div>
                </div>

                {/* Expandable Content */}
                <div className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${expand ? "max-h-100" : "max-h-0"
                    }`} onClick={(e) => e.stopPropagation()}
                > 
                  <label onClick={(e) => addField(e,Pindex)} className={` pr-4 text-right text-3xl transition-all duration-500 ${expand ? "block" : "hidden"}`}>&#43;</label>

                  <div className="p-4 shadow-md min-h-40">
                    {cmd_args.length > 0 ? 
                    
                      cmd_args.map((field : arg_type, index) => (
                        <div key={index} className="flex gap-2 mb-3">
                          { id === "cmd" &&
                            <input
                              type="text"
                              value={field.path}
                              onChange={(e) => handleChange(Pindex, index, "path", e.target.value)}
                              placeholder="provide path"
                              className="p-1 px-3 border rounded w-full outline-none"
                            />
                          }

                          <input
                            type="text"
                            value={field.cmd}
                            onChange={(e) => handleChange(Pindex, index, "cmd", e.target.value)}
                            placeholder={id === "cmd" ? "Cmd to run" : "enter url"}
                            className="p-1 px-3 border rounded w-full outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeField(Pindex, index)}
                            className="text-2xl text-red-600/80"
                          >
                            &times;
                          </button>
                        </div>
                      )) :
                      <div className="text-center">
                        no arguments found!
                      </div>
                    }
                  </div>

                </div> 
              </section>
          ))
        }

      </div> 
    </>
  );
}
