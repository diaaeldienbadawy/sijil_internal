import { JudgeSearchResult } from "@/lib/models/judges/judge-search-result";
import { ExternalLink } from "lucide-react";


export default function JudgeCardFooter({judge}:{judge:JudgeSearchResult}){
    const onClickLink = (e:React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation() 
        window.open(judge.url, "_blank")
    }


    return(        
        <div className="flex md:justify-between justify-start flex-wrap tender-card-footer">
            <div className="flex flex-wrap gap-x-4">
                <div className="flex my-auto p-2 gap-x-1">
                    {judge.has_appeal ? `تاريخ الاستأناف ${judge.appeal_date}` : ''}
                </div>
            </div>
            <div className="flex">
                <div className="flex my-auto p-2 gap-x-1 e3tmad-link" onClick={(e)=>onClickLink(e)}>
                    <ExternalLink/>
                    عرض فى الموقع الرسمي
                </div>
            </div>
        </div>
    )
}