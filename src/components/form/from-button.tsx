import { useState } from "react"
import { Button } from "../ui/button"
import MutatingDots from "../utility/spinners/mutating-dots"
import { Spinner } from "../ui/spinner"

interface Props{
    varient:'default'|'outline'|'secondary'|'ghost'|'destructive'|'link'
    size?:'default'|'xs'|'sm'|'lg'|'xl'|'xxl'|'xxxl'|'icon'
    text: string
    className?: string
    isDisabled?:boolean
    action:()=>Promise<void>
}
export default function FormButton({varient,text,className,isDisabled,size='default',action}:Props){
    const [isLoading,setIsLoading] = useState<boolean>(false)

    const handleClick = async()=>{
        setIsLoading(true)
        
        setTimeout(()=>setIsLoading(false),5000)
        
        //await action()
        //setIsLoading(false)
    }

    return(
        <div className="flex justify-center">
            <Button variant={varient} size={size} className={`w-[90%] mx-auto py-2 font-tajawal font-semibold cursor-pointer  ${className}`} disabled={isLoading||isDisabled} onClick={handleClick}>
                {isLoading ? <Spinner data-icon="inline-start" /> : null}
                {text}
            </Button>
        </div>
    )
}