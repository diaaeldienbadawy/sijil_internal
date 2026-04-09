import { MutatingDots as MutatingDot } from "react-loader-spinner";

export default function MutatingDots(){
    return(
        <MutatingDot
            visible={true}
            height="100"
            width="100"
            color="#4fa94d"
            secondaryColor="#4fa94d"
            radius="12.5"
            ariaLabel="mutating-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />
    )
}