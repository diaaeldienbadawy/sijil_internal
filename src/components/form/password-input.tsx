
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"

interface Props{
    className?: string
    id?:string
    value?:string
    setValue?:Dispatch<SetStateAction<string|undefined>>
    placeholder?:string
    showPassword?:boolean
}


export default function PasswordInput({className,id,value,setValue,placeholder,showPassword}:Props){
    const [hidden,setHidden] = useState<boolean>(true)

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
            <input id={id} type={hidden ? 'password' : 'text'} className={`${className}`} value={value} placeholder={placeholder} onChange={e=>setValue?.(e.target.value)}/>

        </div>

    )
}