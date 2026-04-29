import { CompanySummery } from "@/lib/models/updates/company-summery";
import CompanyCardHeader from "./company-card-header";
import CompanyCardDescription from "./company-card-description";

export default function CompanyCard({summery}:{summery:CompanySummery}){
    return(
        <div className="py-4">
            <div className="card">
                <CompanyCardHeader summery={summery}/>
                <CompanyCardDescription summery={summery}/>
            </div>
        </div>
    )
}