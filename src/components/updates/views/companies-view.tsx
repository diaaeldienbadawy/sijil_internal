import CompaniesListFilter from "../companies-filter/companies-list-filter";
import CompaniesList from "../companies-list/companies-list";

export default function CompaniesView(){
    return(
        <>
            <CompaniesListFilter/>
            <CompaniesList/>
        </>
    )
}