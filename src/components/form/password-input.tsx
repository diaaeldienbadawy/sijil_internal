
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

interface Props{
    className?: string
    id?:string
    value?:string
    setValue?:(v:string|undefined) => void;
    placeholder?:string
    showPassword?:boolean
}


export default function PasswordInput({className,id,value,setValue,placeholder,showPassword}:Props){
    const [hidden,setHidden] = useState<boolean>(true)

    const ref = useRef<HTMLInputElement>(null)

    useEffect(()=>{ 
        if(ref.current){
            if(ref.current.value){
                setValue?.(ref.current.value ?? value)
            }
        }
    },[])

    return(
        <div className="relative p-0">
            {
                showPassword?
                <div className="absolute h-full end-[20px] p-0 flex flex-col justify-center cursor-pointer">
                    <div className="text-muted" onClick={()=>setHidden(!hidden)}>
                        {hidden? <EyeOffIcon size={18}/> : <EyeIcon size={18}/>} 
                    </div>
                </div>:null
            }
            <input
                ref={ref}
                id={id} 
                type={hidden ? 'password' : 'text'} 
                className={`${className}`} 
                value={value ?? ""} 
                placeholder={placeholder} 
                onChange={e=>setValue?.(e.target.value)}
                onInput={(e) => setValue?.((e.target as HTMLInputElement).value)}    
            />
        </div>
    )
}