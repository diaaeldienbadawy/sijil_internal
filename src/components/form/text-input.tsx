import { DetailedHTMLProps, Dispatch, InputHTMLAttributes, SetStateAction, useEffect, useRef } from "react"

interface Props{
    className?: string
    id?:string
    value?:string
    setValue?:Dispatch<SetStateAction<string|undefined>>
    placeholder?:string
}

export default function TextInput({className,id,value,setValue,placeholder}:Props){
    const ref = useRef<HTMLInputElement>(null)
    
    useEffect(()=>{ 
        if(ref.current){
            if(ref.current.value){
                setValue?.(ref.current.value ?? value)
            }
        }
    },[])

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