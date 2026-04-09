import { Dispatch, ReactNode, SetStateAction, useMemo } from "react"
import TextInput from "./text-input"
import PasswordInput from "./password-input"
import CheckboxInput from "./checkbox-input"

interface Props{
    lable?:string
    placeholder?:string
    dir?:'virtical'|'horizontal'
    value? : string
    checked?: boolean
    setValue?: Dispatch<SetStateAction<string|undefined>>
    setChecked?: Dispatch<SetStateAction<boolean|undefined>>
    type?:'text'|'password'|'checkbox'
}

export default function LabeledInput({lable,value,placeholder,checked,setValue,setChecked,type="text",dir="virtical"}:Props){
    const id = useMemo(()=>Math.random().toString() ,[])
    
    return(
        <div dir={dir == 'virtical' ? 'rtl' : 'ltr'} className={` w-[90%] mx-auto py-1 ${dir=='horizontal' ? 'flex justify-end':''}`}>
            <label className="font-tajawal py-1 my-auto cursor-pointer text-muted" htmlFor={id} onClick={()=>setChecked?.(!checked)}>
                <h4 className="font-tajawal">{lable}</h4>
            </label>
            <div className={`${dir=='virtical'?'py-3':'p-3'}`}>
                {
                    type == 'text' ? <TextInput id={id} className="p-4 border-2 border-ring rounded-xl w-full text-lg" value={value} setValue={setValue} placeholder={placeholder}/>:
                    type == 'password' ? <PasswordInput id={id} className="p-4 border-2 border-ring rounded-xl w-full text-lg" showPassword value={value} setValue={setValue} placeholder={placeholder}/>:
                    type == 'checkbox' ? <CheckboxInput id={id}  value={checked} placeholder={placeholder} setValue={setChecked} />:null
                }
            </div>
        </div>
    )
}