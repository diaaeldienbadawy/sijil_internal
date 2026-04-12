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
    isLoading?:boolean
    isSubmit?:boolean
    action?:()=>Promise<void>
}
export default function FormButton({varient,text,className,isDisabled,isSubmit,isLoading,size='default',action}:Props){

    return(
        <div className="flex justify-center">
            <Button 
                variant={varient} 
                size={size} 
                className={`w-[90%] mx-auto py-2 font-tajawal font-semibold cursor-pointer  ${className}`} 
                disabled={isLoading||isDisabled} 
                onClick={action}
                type={isSubmit?'submit':'button'}
                >
                {isLoading ? <Spinner data-icon="inline-start" /> : null}
                {text}
            </Button>
        </div>
    )
}