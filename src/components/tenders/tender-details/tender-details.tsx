import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import useTenderDetails from "./use-tender-details"
import TenderDetailsHeader from "./tender-details-header"
import TenderDetailsTitle from "./tender-details-title"
import TenderDetailsStatistics from "./tender-details-statistics"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import TenderDetailsDatesSection from "./tender-details-dates-section"
import TenderDetailsCompetionSection from "./tender-details-competion-section"
import TenderDetailsClassificationSection from "./tender-details-classification-section"
import TenderDetailsLocalContentSection from "./tender-details-local-content"
import MutatingDots from "@/components/utility/spinners/mutating-dots"


export default function TenderDetails(){
    const {data,isLoading,error} = useTenderDetails()

    return(
        isLoading?<MutatingDots />  :
        data ? 
        <div className="popover-content-details flex flex-col">
            <TenderDetailsHeader tender={data} />
            <div className="popover-content-details-contentt">

                <TenderDetailsTitle tender={data}/>
                <TenderDetailsStatistics tender={data}/>
                <Accordion className="popover-content-details-accordion lg:w-[1200px]" type="multiple" defaultValue={["dates","competionDetails","classification"]}>
                    <AccordionItem value="dates">
                        <AccordionTrigger >
                             المواعيد و التواريخ        
                        </AccordionTrigger>
                        <AccordionContent>
                            <TenderDetailsDatesSection tender={data} />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="competionDetails">
                        <AccordionTrigger >
                            تفاصيل المنافسة
                        </AccordionTrigger>
                        <AccordionContent>
                            <TenderDetailsCompetionSection tender={data} />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="classification">
                        <AccordionTrigger>
                            التصنيف و مجال التنفيذ
                        </AccordionTrigger>
                        <AccordionContent>
                            <TenderDetailsClassificationSection tender={data} />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="localContent">
                        <AccordionTrigger>
                            المحتوى المحلى
                        </AccordionTrigger>
                        <AccordionContent>
                            <TenderDetailsLocalContentSection tender={data} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div> 
        : 
        <div>tender details not available</div>
    )
}