import HighlightedText from "@/components/utility/spinners/highlighted-text";
import NumbersHelper from "@/lib/helpers/numbers-helper";
import { CompanySummery } from "@/lib/models/updates/company-summery";
import { ExternalLink, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

export default function CompanyCardDescription({
  summery
}: {
  summery: CompanySummery;
}) {
  const items = [
    { label: "الاسم الرسمي", value: summery.canonical_name },
    { label: "الموقع الإلكتروني", value: summery.primary_website },
    { label: "العنوان", value: summery.address },
    { label: "المدينة", value: summery.city },
    { label: "الفئة", value: summery.category },
    { label: "النشاط", value: summery.activity },
  ];

  return (
    <div className="card-description">
      <div className="flex flex-wrap">
        {items.map(
          (item, index) =>
             (
              <div key={index} className="company-info-item flex md:w-[50%] md:py-2 w-[100%] ">
                <div className="w-[30%]">
                    <span className="label">{item.label}: </span>
                </div>
                <div className="w-[70%]">
                    {index == 1 ? (
                        <div className="flex gap-3 hover:underline hover:text-[rgb(0,0,255)]" onClick={()=>window.open(item.value,'_blank')}>{item.value ?? '-----'}<ExternalLinkIcon/></div>
                    ):(
                        <span >{item.value ?? '-----'}</span>
                    )}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}