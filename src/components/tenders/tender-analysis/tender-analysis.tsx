import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overveiw from "./overview";
import Suppliers from "./suppliers";
import Activities from "./activities";
import useTenderAnalysis from "./use-tender-analysis";

export default function TenderAnalysis(){
    const {analysisTenderIds,analyticsProgess,analysisTenderDetails} = useTenderAnalysis()

    return(
    <Tabs defaultValue="overview" className="w-[400px]">
        <TabsList>
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="suppliers">الموردين</TabsTrigger>
            <TabsTrigger value="activities">الانشطة</TabsTrigger>
        </TabsList>
        <Overveiw tenders={analysisTenderDetails.data}/>
        <Suppliers/>
        <Activities/>
    </Tabs>
    )
}