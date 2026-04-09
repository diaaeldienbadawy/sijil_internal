import { Dispatch, SetStateAction, useState } from "react"
import { CheckIcon } from 'lucide-react';

interface Props{
    className?: string
    id?:string
    value?:boolean
    setValue?:Dispatch<SetStateAction<boolean|undefined>>
    placeholder?:string
}


export default function CheckboxInput({className,id,value,setValue,placeholder}:Props){
    return(
        <div className={`rounded-[3px] ${value ? 'bg-primary' : 'bg-white border border-muted'} cursor-pointer text-paper m-auto flex w-[22px] h-[22px] ${className}`} onClick={()=>setValue?.(!value)}>
           {
            value ? <CheckIcon className="m-auto" size={18}/> : null
           } 
        </div>
    )
}