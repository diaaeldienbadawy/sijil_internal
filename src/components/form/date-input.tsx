import { DetailedHTMLProps, Dispatch, InputHTMLAttributes, SetStateAction, useEffect, useRef, useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import dayjs, { Dayjs } from "dayjs"

interface Props{
    className?: string
    id?:string
    value?:string
    setValue?:(v:string|undefined) => void;
    placeholder?:string
}

export default function DateInput({className,id,value,setValue,placeholder}:Props){
    const ref = useRef<HTMLInputElement>(null)
    
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Dayjs | undefined>(undefined)
    const [month, setMonth] = useState<Dayjs | undefined>(date)

    function formatDate(date: Dayjs | undefined) {
      const d:Dayjs| undefined =date
 
      console.log("date dses1",d)
      if (!d) {
        return ""
      }

      console.log("date dses2", d.format("YYYY MMM DD"))

      return d.format("YYYY MMM DD")
    }

    function isValidDate(date: Dayjs | undefined) {
      if (!date) {
        return false
      }
      return !isNaN(date.minute())
    }


    useEffect(()=>{ 
        if(value == undefined){
            setValue?.(formatDate(date))
        }
        if(ref.current){
            if(ref.current.value){
                setValue?.(ref.current.value ?? value)
            }
        }
    },[])

    useEffect(()=>{
        console.log("value dses",value)
        if(value) setDate(dayjs(value))
    },[value])

    useEffect(()=>{
        console.log("date dses",date)
    },[date])

    console.log("open is ", open)

    return(
          <InputGroup className={className}>
            <InputGroupInput
                ref={ref}
                className="h-auto"
                id="date-required"
                value={value}
                placeholder="اخرت التاريخ"
                onChange={(e) => {
                  const date = dayjs(e.target.value)
                  setValue?.(formatDate(date))
                  if (isValidDate(date)) {
                    setDate(date)
                    setMonth(date)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault()
                    setOpen(true)
                  }
                }}
            />
            <InputGroupAddon align="inline-start">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                <button type="button">
                  <CalendarIcon />
                </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0 add-filter-select-content"
                  align="start"
                  alignOffset={-15}
                  sideOffset={20}
                >
                  <Calendar
                    mode="single"
                    selected={date?.toDate()}
                    month={month?.toDate()}
                    onMonthChange={e=>setMonth(dayjs(e))}
                    modifiersClassNames={{
                        today : "bg-transparent"
                    }}
                    onSelect={(date) => {
                      console.log("eesss",date)
                      console.log("eesss",dayjs(date))
                      console.log("eesss",formatDate(dayjs(date)))
                      setValue?.(formatDate(dayjs(date)))
                      setOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
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
            type="date"
            onChange={e=>setValue?.(e.target.value)}
        />
    )
}