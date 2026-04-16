import {  Dispatch, SetStateAction, useEffect, useRef} from "react"

import { InfoIcon, Search } from "lucide-react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

interface Props{
    className?: string
    id?:string
    value?:string
    setValue?:Dispatch<SetStateAction<string|undefined>>
    placeholder?:string
    searchMode?: "automatic" | "phrases" | "segments"
    setSearchMode?:(mode:"automatic" | "phrases" | "segments")=>void
}

export default function SearchInput({className,id,value,setValue,placeholder,searchMode,setSearchMode}:Props){
    const ref = useRef<HTMLInputElement>(null)
    
    useEffect(()=>{ 
        if(ref.current){
            if(ref.current.value){
                setValue?.(ref.current.value ?? value)
            }
        }
    },[])

    return(
          <InputGroup className={` ${className}`}>
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
            <InputGroupAddon  align="inline-end">
              <div className="flex gap-2 px-2">
                <div className="flex justify-center items-center">
                    <div 
                        className= {`search-mode ${searchMode === "automatic" ? "selected-search-mode" : ""}`}
                        onClick={()=>setSearchMode?.("automatic")}    
                        >
                        تلقائي
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <div 
                        className= {`search-mode ${searchMode === "phrases" ? "selected-search-mode" : ""}`}
                        onClick={()=>setSearchMode?.("phrases")}    
                        >
                        عبارات
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <div 
                        className= {`search-mode ${searchMode === "segments" ? "selected-search-mode" : ""}`}
                        onClick={()=>setSearchMode?.("segments")}    
                        >
                        مقاطع
                    </div>
                </div>
            </div>
            </InputGroupAddon>
          </InputGroup>

    )
    return(
        <input 
            ref={ref}
            id={id} 
            className={`${className}`} 
            value={value ?? ""} 
            placeholder={placeholder} 
            onChange={e=>setValue?.(e.target.value)}
        />
    )
}