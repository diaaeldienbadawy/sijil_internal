import { MutatingDots as MutatingDot } from "react-loader-spinner";

interface Props{
    scale?:number
}

export default function MutatingDots({scale=1}:Props){
    return(
        <div className="flex w-full h-full justify-center items-center">
            <MutatingDot
                visible={true}
                height={100*scale}
                width={100*scale}
                color="#4fa94d"
                secondaryColor="#4fa94d"
                radius={12.5*scale}
                ariaLabel="mutating-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    )
}