import {  Dispatch, SetStateAction, useEffect, useRef} from "react"

import { InfoIcon, Search } from "lucide-react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { TenderSearchMode } from "@/lib/models/tenders/tender-search-mode"
import { useAppDispatch } from "@/lib/redux/hooks"
import { JudgesSearchMode } from "@/lib/models/judges/judges-search-mode"

interface Props{
    className?: string
    id?:string
    value?:string
    setValue?:Dispatch<SetStateAction<string|undefined>>
    placeholder?:string
    searchMode?: JudgesSearchMode | TenderSearchMode
    setSearchMode?:(mode?:JudgesSearchMode | TenderSearchMode)=>void
    type:string
}

export default function SearchInput({className,id,type,value,setValue,placeholder,searchMode,setSearchMode}:Props){
    const ref = useRef<HTMLInputElement>(null)

    useEffect(()=>{ 
        if(ref.current){
            if(ref.current.value){
                setValue?.(ref.current.value ?? value)
            }
        }
    },[])

    useEffect(()=>{
        console.log("search mode is ", searchMode)
    },[searchMode])

    return(
          <InputGroup className={` ${className} flex flex-wrap md:flex-nowrap`}>
             <InputGroupAddon  align="inline-start">
              <Search /> 
            </InputGroupAddon>
            <InputGroupInput 
                id="input-group-url" 
                className="tenders-search-text-field"
                value={value} 
                onChange={e=>setValue?.(e.target.value)} 
                placeholder={placeholder}
            />
            <InputGroupAddon className="py-2 md:py-0" align="inline-end">
              <div className="flex gap-2 px-2">
                {
                    type == 'tenders'?(
                    <>
                        <div className="flex justify-center items-center">
                            <div 
                                className= {`search-mode ${searchMode  === "smart" ? "selected-search-mode" : ""}`}
                                onClick={()=>setSearchMode?.(searchMode === 'smart' ? undefined:'smart')}    
                                >
                                تلقائي
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div 
                                className= {`search-mode ${searchMode  === "phrase" ? "selected-search-mode" : ""}`}
                                onClick={()=>setSearchMode?.(searchMode === 'phrase' ? undefined :'phrase')}    
                                >
                                جمل
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div 
                                className= {`search-mode ${searchMode  === "tokens" ? "selected-search-mode" : ""}`}
                                onClick={()=>setSearchMode?.(searchMode === 'tokens' ? undefined : 'tokens')}    
                                >
                               كلمات
                            </div>
                        </div>
                    </>
                    ):
                    type == 'judges'? (
                        <>
                        <div className="flex justify-center items-center">
                            <div 
                                className= {`search-mode ${searchMode === "any" ? "selected-search-mode" : ""}`}
                                onClick={()=>setSearchMode?.(searchMode === 'any' ? undefined : "any")}    
                                >
                                اي كلمة
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div 
                                className= {`search-mode ${searchMode === "all" ? "selected-search-mode" : ""}`}
                                onClick={()=>setSearchMode?.(searchMode === 'all' ? undefined :"all")}    
                                >
                                جميع الكلمات
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div 
                                className= {`search-mode ${searchMode === "exact" ? "selected-search-mode" : ""}`}
                                onClick={()=>setSearchMode?.(searchMode === 'exact' ? undefined : "exact")}    
                                >
                                مطابقة
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div 
                                className= {`search-mode ${searchMode === "exact_number" ? "selected-search-mode" : ""}`}
                                onClick={()=>setSearchMode?.(searchMode === 'exact_number' ? undefined : "exact_number")}    
                                >
                                رقم القضية/الحكم
                            </div>
                        </div>
                    </>
                    ):null
                }
            </div>
            </InputGroupAddon>
          </InputGroup>

    )
}