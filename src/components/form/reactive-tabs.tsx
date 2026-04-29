import { CSSProperties } from "react"

interface Props{
    tabs:{
        name:string,
        value:string
    }[],
    onChange:(selected:string)=>void
    value:string
    styles?: CSSProperties
}

export default function ReactiveTabs({tabs,onChange,value,styles}:Props){
    return <div className="flex gap-4 py-3">
        {
            tabs.map((item,index)=>(
                <div 
                    key={index} 
                    className={`reactive-tab ${item.value == value ? 'selected':''}`} 
                    onClick={()=>onChange(item.value)}
                    style={styles}
                >
                    {item.name}
                </div>
            ))
        }
    </div>
}