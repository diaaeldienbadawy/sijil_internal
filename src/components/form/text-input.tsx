import { Dispatch, SetStateAction } from "react"

interface Props{
    className?: string
    id?:string
    value?:string
    setValue?:Dispatch<SetStateAction<string|undefined>>
    placeholder?:string
}

export default function TextInput({className,id,value,setValue,placeholder}:Props){
    return(
        <input id={id} className={`${className}`} value={value} placeholder={placeholder} onChange={e=>setValue?.(e.target.value)}/>
    )
}