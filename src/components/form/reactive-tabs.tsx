interface Props{
    tabs:{
        name:string,
        value:string
    }[],
    onChange:(selected:string)=>void
    value:string
}

export default function ReactiveTabs({tabs,onChange,value}:Props){
    return <div className="flex gap-4 py-3">
        {
            tabs.map((item,index)=>(
                <div key={index} className={`reactive-tab ${item.value == value ? 'selected':''}`} onClick={()=>onChange(item.value)}>
                    {item.name}
                </div>
            ))
        }
    </div>
}