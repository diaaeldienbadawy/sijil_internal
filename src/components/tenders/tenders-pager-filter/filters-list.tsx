import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FilterContents } from "@/lib/models/tenders/filter-content"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setBidEvaluationDateAvailability, setBidOpeningDateAvailability, setBidSubmissionDeadlineDateAvailability, setExpectedAwardDateAvailability, setInquiriesDateAvailability, setPublishDateAvailability, setQuestionsStartDateAvailability, setReferenceNumberAvailability, setSenderIdAvailability, setTenderNumberAvailability, setWorkStartDateAvailability } from "@/lib/redux/slices/state_slices/tender-filter-content-slice"

export default function FiltersList({filters}:{filters:FilterContents}){
    const dispatch = useAppDispatch()

    return(
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <div className="add-filter-select">
                    الفلاتر
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="add-filter-select-content">
                <DropdownMenuGroup   className="add-filter-select-group">
                    <DropdownMenuLabel className="text-md text-muted">اختر الفلاتر المطلوبة</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem 
                        className={`focus:outline-none cursor-pointer ${filters.sender_id.available ? "bg-primary-light text-gold-light" : ""}`} 
                        onClick={e=>{
                            e.preventDefault()
                            dispatch(setSenderIdAvailability(!filters.sender_id.available))
                        }} 
                        checked={filters.sender_id.available}
                    >
                        {filters.sender_id.name}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                        className={`focus:outline-none cursor-pointer ${filters.reference_number.available ? "bg-primary-light text-gold-light" : ""}`} 
                        onClick={e=>{
                            e.preventDefault()
                            dispatch(setReferenceNumberAvailability(!filters.reference_number.available))
                        }} 
                        checked={filters.reference_number.available}
                    >
                        {filters.reference_number.name}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                        className={`focus:outline-none cursor-pointer ${filters.tender_number.available ? "bg-primary-light text-gold-light" : ""}`} 
                        onClick={e=>{
                            e.preventDefault()
                            dispatch(setTenderNumberAvailability(!filters.tender_number.available))
                        }} 
                        checked={filters.tender_number.available}
                    >
                        {filters.tender_number.name}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                        className={`focus:outline-none cursor-pointer ${filters.publish_date.available ? "bg-primary-light text-gold-light" : ""}`} 
                        onClick={e=>{
                            e.preventDefault()
                            dispatch(setPublishDateAvailability(!filters.publish_date.available))
                        }} 
                        checked={filters.publish_date.available}
                    >
                        {filters.publish_date.name}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                        className={`focus:outline-none cursor-pointer ${filters.inquiries_deadline_date.available ? "bg-primary-light text-gold-light" : ""}`} 
                        onClick={e=>{
                            e.preventDefault()
                            dispatch(setInquiriesDateAvailability(!filters.inquiries_deadline_date.available))
                        }} 
                        checked={filters.inquiries_deadline_date.available}
                    >
                        {filters.inquiries_deadline_date.name}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                        className={`focus:outline-none cursor-pointer ${filters.bid_evaluation_date.available ? "bg-primary-light text-gold-light" : ""}`} 
                        onClick={e=>{
                            e.preventDefault()
                            dispatch(setBidEvaluationDateAvailability(!filters.bid_evaluation_date.available))
                        }} 
                        checked={filters.bid_evaluation_date.available}
                    >
                        {filters.bid_evaluation_date.name}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                        className={`focus:outline-none cursor-pointer ${filters.expected_award_date.available ? "bg-primary-light text-gold-light" : ""}`} 
                        onClick={e=>{
                            e.preventDefault()
                            dispatch(setExpectedAwardDateAvailability(!filters.expected_award_date.available))
                        }} 
                        checked={filters.expected_award_date.available}
                    >
                        {filters.expected_award_date.name}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                        className={`focus:outline-none cursor-pointer ${filters.work_start_date.available ? "bg-primary-light text-gold-light" : ""}`} 
                        onClick={e=>{
                            e.preventDefault()
                            dispatch(setWorkStartDateAvailability(!filters.work_start_date.available))
                        }} 
                        checked={filters.work_start_date.available}
                    >
                        {filters.work_start_date.name}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                        className={`focus:outline-none cursor-pointer ${filters.questions_start_date.available ? "bg-primary-light text-gold-light" : ""}`} 
                        onClick={e=>{
                            e.preventDefault()
                            dispatch(setQuestionsStartDateAvailability(!filters.questions_start_date.available))
                        }} 
                        checked={filters.questions_start_date.available}
                    >
                        {filters.questions_start_date.name}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                        className={`focus:outline-none cursor-pointer ${filters.bid_submission_deadline.available ? "bg-primary-light text-gold-light" : ""}`} 
                        onClick={e=>{
                            e.preventDefault()
                            dispatch(setBidSubmissionDeadlineDateAvailability(!filters.bid_submission_deadline.available))
                        }} 
                        checked={filters.bid_submission_deadline.available}
                    >
                        {filters.bid_submission_deadline.name}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                        className={`focus:outline-none cursor-pointer ${filters.bid_opening.available ? "bg-primary-light text-gold-light" : ""}`} 
                        onClick={e=>{
                            e.preventDefault()
                            dispatch(setBidOpeningDateAvailability(!filters.bid_opening.available))
                        }} 
                        checked={filters.bid_opening.available}
                    >
                        {filters.bid_opening.name}
                    </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}