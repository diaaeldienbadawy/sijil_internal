import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Tender } from "@/lib/models/tenders/tender";
import useOverview from "./useOverview";

export default function Overveiw({tenders}:{tenders?:Tender[]}){
    const {totalTenders, totalAwards, avgAwards, heighestAward, lowestAward, averageCompetitors} = useOverview({tenders})

    return(      
        <TabsContent value="overview">
            <Card>
              <CardHeader hidden>
              </CardHeader>
              <CardContent className="">
                <div className="tender-details-statistics flex flex-wrap">
                    <div className="statistic">
                        <div>إجمالي المنافسات</div>
                        <div>{totalTenders}</div>
                    </div>
                    <div className="statistic">
                        <div>إجمالي الترسيات</div>
                        <div>{totalAwards}</div>
                    </div>
                    <div className="statistic">
                        <div>متوسط الترسية</div>
                        <div>{avgAwards}</div>
                    </div>
                    <div className="statistic">
                        <div>أعلى ترسية</div>
                        <div>{heighestAward}</div>
                    </div>
                    <div className="statistic">
                        <div>أقل ترسية</div>
                        <div>{lowestAward}</div>
                    </div>
                    <div className="statistic">
                        <div>متوسط المتنافسين</div>
                        <div>{averageCompetitors}</div>
                    </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>
    )    
}