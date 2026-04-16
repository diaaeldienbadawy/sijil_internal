import { Dispatch, SetStateAction, useMemo } from "react"
import TextInput from "./text-input"
import PasswordInput from "./password-input"
import CheckboxInput from "./checkbox-input"
import DateInput from "./date-input"

interface Props{
    label?:string
    placeholder?:string
    dir?:'virtical'|'horizontal'
    value? : string
    checked?: boolean
    setValue?: (v:string|undefined) => void; 
    setChecked?: Dispatch<SetStateAction<boolean|undefined>>
    type?:'text'|'password'|'checkbox'|'date'
    lableClassName?:string
    inputClassName?:string
    containerClassName?:string
}

export default function LabeledInput({label,value,placeholder,checked,lableClassName,inputClassName,containerClassName,setValue,setChecked,type="text",dir="virtical"}:Props){
    const id = useMemo(()=>Math.random().toString() ,[])
    
    return(
        <div dir={dir == 'virtical' ? 'rtl' : 'ltr'} className={` w-[90%] mx-auto py-1 ${dir=='horizontal' ? 'flex justify-end':''} ${containerClassName}`}>
            <label className={  "font-tajawal py-1 my-auto cursor-pointer text-muted " +lableClassName} htmlFor={id} onClick={()=>setChecked?.(!checked)}>
                <h4 className="font-tajawal">{label}</h4>
            </label>
            <div className={`${dir=='virtical'?'py-3':'p-3'}`}>
                {
                    type == 'text' ? <TextInput id={id} className={"p-4 border-2 border-ring rounded-xl w-full text-lg " + inputClassName} value={value} setValue={setValue} placeholder={placeholder}/>:
                    type == 'password' ? <PasswordInput id={id} className={"p-4 border-2 border-ring rounded-xl w-full text-lg " + inputClassName} showPassword value={value} setValue={setValue} placeholder={placeholder}/>:
                    type == 'checkbox' ? <CheckboxInput id={id}  value={checked} placeholder={placeholder} setValue={setChecked} />:
                    type == 'date' ? <DateInput id={id} className={"p-4 border-2 border-ring rounded-xl w-full text-lg " + inputClassName} value={value} setValue={setValue} placeholder={placeholder}/> :null
                }
            </div>
        </div>
    )
}