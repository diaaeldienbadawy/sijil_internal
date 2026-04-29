import NumbersHelper from "@/lib/helpers/numbers-helper";
import { JudgmentSummary } from "@/lib/models/judges/judgment-summary";
import { CompanySummery } from "@/lib/models/updates/company-summery";

export default function CompanyCardHeader({summery}:{summery:CompanySummery}){
    return(        
        <div className="flex justify-between card-header">
            <div className="flex">
                <div>
                    {summery.canonical_name}
                </div>
                <div className="flex flex-col justify-end px-4 gap-x-2 mx-auto text-gold text-lg">
                    <div className="flex">
                        <div className="mx-auto px-2">
                            {summery.city}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
}