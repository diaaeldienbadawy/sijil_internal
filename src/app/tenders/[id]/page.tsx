'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getTenderById } from '@/lib/api';
import type { Tender, TenderBidder, TenderAwarded } from '@/types';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

function fmtDate(d:string|undefined|null){if(!d)return '—';try{return format(parseISO(d),'d MMM yyyy',{locale:ar});}catch{return d;}}
function fmtDateTime(d:string|undefined|null){if(!d)return '—';try{return format(parseISO(d),'d MMM yyyy HH:mm',{locale:ar});}catch{return d;}}
function fmtSar(a:string|undefined|null):string{if(!a)return '—';const n=parseFloat(a);if(isNaN(n))return a;return n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' ر.س';}

// Icons
const BackIcon=()=><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>;
const ChevronDown=({open}:{open:boolean})=><svg className="w-4 h-4 transition-transform duration-200" style={{transform:open?'rotate(180deg)':''}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>;
const ExternalIcon=()=><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>;

function statusColor(s:string|undefined):{bg:string;color:string}{
  if(!s) return {bg:'#f1f5f9',color:'var(--text-3)'};
  // Active
  if(s==='قبول العروض'||s==='مرحلة المزايدة المباشرة') return {bg:'var(--brand-lighter)',color:'var(--brand)'};
  // Evaluation
  if(s==='تقييم العروض'||s==='بإنتظار إعتماد تقرير فتح العروض الفنية'||s==='بانتظار اعتماد تقييم العروض المالية') return {bg:'var(--warn-bg)',color:'var(--warn)'};
  // Pending
  if(s==='في انتظار الترسية'||s==='بإنتظار موافقة لجنة الإستثناء'||s==='معادة للترسية بسبب قبول طلب التظلم') return {bg:'#fef3c7',color:'#92400e'};
  // Awarded
  if(s==='تمت الترسية'||s==='تم اعتماد الترسية') return {bg:'var(--success-bg)',color:'var(--success)'};
  // Cancelled
  if(s==='تم إلغاء المنافسة'||s==='تم رفض تقرير فتح العروض') return {bg:'var(--danger-bg)',color:'var(--danger)'};
  // Ended / other
  return {bg:'#f1f5f9',color:'var(--text-3)'};
}

function Section({title,icon,defaultOpen=false,count,children}:{title:string;icon:string;defaultOpen?:boolean;count?:number;children:React.ReactNode}) {
  const [open,setOpen]=useState(defaultOpen);
  return (
    <div className="card overflow-hidden">
      <button onClick={()=>setOpen(!open)} className="w-full flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-slate-50">
        <span className="flex items-center gap-2 text-sm font-semibold" style={{color:'var(--text)'}}><span>{icon}</span>{title}{count!==undefined&&<span className="badge badge-gray text-[11px]">{count}</span>}</span>
        <ChevronDown open={open}/>
      </button>
      {open&&<div className="px-5 pb-5 animate-fadeIn" style={{borderTop:'1px solid var(--border)'}}><div className="pt-4">{children}</div></div>}
    </div>
  );
}

function Field({label,value,mono}:{label:string;value:React.ReactNode;mono?:boolean}) {
  if(!value||value==='—'||value===null) return null;
  return <div><div className="text-xs font-semibold mb-0.5" style={{color:'var(--text-3)'}}>{label}</div><div className={`text-sm ${mono?'font-mono':''}`} style={{color:'var(--text)',direction:mono?'ltr':'inherit',textAlign:mono?'right':'inherit'}}>{value}</div></div>;
}

export default function TenderDetailPage() {
  const router=useRouter(); const params=useParams(); const id=params.id as string;
  const {isLoading:authLoading,isLoggedIn}=useAuth();
  const {data:t,isLoading,error}=useQuery({queryKey:['tender',id],queryFn:()=>getTenderById(id),enabled:isLoggedIn&&!!id});

  useEffect(()=>{const h=(e:KeyboardEvent)=>{if(e.key==='Escape') goBack();};window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h);});

  const goBack=()=>{if(window.history.length>1) router.back(); else router.push('/tenders');};

  if(authLoading) return <div className="min-h-screen flex items-center justify-center" style={{background:'var(--surface-dim)'}}><div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin" style={{borderTopColor:'var(--accent)',borderLeftColor:'var(--accent)'}}/></div>;
  if(!isLoggedIn) return null;

  if(isLoading) return (
    <div className="min-h-screen" style={{background:'var(--surface-dim)'}}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="skeleton h-10 w-24 mb-4"/>
        <div className="card p-6 space-y-4"><div className="skeleton h-8 w-3/4"/><div className="skeleton h-5 w-1/2"/><div className="grid grid-cols-3 gap-4 mt-4"><div className="skeleton h-16"/><div className="skeleton h-16"/><div className="skeleton h-16"/></div></div>
        <div className="card p-6 space-y-3"><div className="skeleton h-6 w-40"/><div className="skeleton h-4 w-full"/><div className="skeleton h-4 w-2/3"/></div>
      </div>
    </div>
  );

  if(error||!t) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'var(--surface-dim)'}}>
      <div className="card p-8 text-center max-w-sm"><p className="text-sm mb-3" style={{color:'var(--danger)'}}>فشل تحميل المنافسة</p><button onClick={goBack} className="btn-primary btn-sm">العودة</button></div>
    </div>
  );

  const sc=statusColor(t.competition_status);

  return (
    <div className="min-h-screen" style={{background:'var(--surface-dim)'}}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back button */}
        <button onClick={goBack} className="btn-ghost btn-sm mb-4 gap-1"><BackIcon/> العودة للقائمة</button>

        {/* Hero */}
        <div className="card overflow-hidden mb-4" style={{borderTop:'4px solid var(--accent)'}}>
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                {t.tender_type&&<span className="badge badge-blue text-[11px] mb-2 inline-block">{t.tender_type}</span>}
                <h1 className="text-lg font-bold leading-relaxed" style={{color:'var(--text)'}}>{t.name}</h1>
                {t.agency_name&&<p className="mt-1.5 text-sm" style={{color:'var(--text-2)'}}>{t.agency_name}</p>}
              </div>
              {t.competition_status&&<span className="badge flex-shrink-0" style={{background:sc.bg,color:sc.color}}>{t.competition_status}</span>}
            </div>
            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3 rounded-lg" style={{background:'var(--surface-dim)'}}><div className="text-xs mb-0.5" style={{color:'var(--text-3)'}}>الرقم المرجعي</div><div className="text-sm font-mono font-medium" style={{direction:'ltr',textAlign:'right'}}>{t.reference_number||'—'}</div></div>
              <div className="p-3 rounded-lg" style={{background:'var(--surface-dim)'}}><div className="text-xs mb-0.5" style={{color:'var(--text-3)'}}>تاريخ النشر</div><div className="text-sm font-medium">{fmtDate(t.publish_date)}</div></div>
              <div className="p-3 rounded-lg" style={{background:'var(--surface-dim)'}}><div className="text-xs mb-0.5" style={{color:'var(--text-3)'}}>قيمة الوثائق</div><div className="text-sm font-medium">{t.documents_price_sar==='0'||t.documents_price_sar==='0.00'?'مجاناً':fmtSar(t.documents_price_sar)}</div></div>
              <div className="p-3 rounded-lg" style={{background:'var(--surface-dim)'}}><div className="text-xs mb-0.5" style={{color:'var(--text-3)'}}>الوقت المتبقي</div><div className="text-sm font-medium">{t.remaining_time_text||'—'}</div></div>
            </div>
            {t.details_url&&<a href={t.details_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-sky-700" style={{color:'var(--accent)'}}><ExternalIcon/> عرض في اعتماد</a>}
          </div>
        </div>

        <div className="space-y-3">
          {/* Dates */}
          {t.dates&&<Section title="المواعيد والتواريخ" icon="📅" defaultOpen>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              <Field label="آخر موعد للاستفسارات" value={fmtDate(t.dates.inquiries_deadline_date)}/>
              <Field label="آخر موعد لتقديم العروض" value={fmtDateTime(t.dates.bid_submission_deadline_at)}/>
              <Field label="تاريخ فتح المظاريف" value={fmtDateTime(t.dates.bid_opening_at)}/>
              <Field label="تاريخ تقييم العروض" value={fmtDate(t.dates.bid_evaluation_date)}/>
              <Field label="تاريخ الترسية المتوقع" value={fmtDate(t.dates.expected_award_date)}/>
              <Field label="تاريخ بدء العمل" value={fmtDate(t.dates.work_start_date)}/>
              <Field label="مكان فتح المظاريف" value={t.dates.bid_opening_location}/>
              <Field label="فترة التوقف (أيام)" value={t.dates.stoppage_period_days?.toString()}/>
            </div>
          </Section>}

          {/* Details */}
          <Section title="تفاصيل المنافسة" icon="📋" defaultOpen>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              <Field label="الغرض" value={t.purpose}/>
              <Field label="طريقة التقديم" value={t.submission_method}/>
              <Field label="مدة العقد" value={t.contract_duration}/>
              <Field label="نوع الاتفاقية" value={t.agreement_type}/>
              <Field label="مدة الاتفاقية" value={t.agreement_duration}/>
              <Field label="الضمان الابتدائي" value={t.preliminary_guarantee}/>
              <Field label="نسبة الضمان النهائي" value={t.final_guarantee_percent}/>
              <Field label="التأمين المطلوب" value={t.insurance_required}/>
              <Field label="الجهات المستفيدة" value={t.beneficiary_entities}/>
              <Field label="رقم الترسية" value={t.award_number}/>
            </div>
          </Section>

          {/* Classification */}
          {t.classification&&<Section title="التصنيف ومجال التنفيذ" icon="🏗️">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <Field label="مجال التصنيف" value={t.classification.classification_field}/>
              <Field label="نطاق التنفيذ" value={t.classification.execution_place?.scope}/>
              {t.classification.execution_place?.regions&&t.classification.execution_place.regions.length>0&&(
                <div className="sm:col-span-2"><div className="text-xs font-semibold mb-1" style={{color:'var(--text-3)'}}>مناطق التنفيذ</div>
                  <div className="flex flex-wrap gap-1.5">{t.classification.execution_place.regions.map(r=><span key={r.name} className="badge badge-blue text-[11px]">{r.name}{r.cities.length>0&&` (${r.cities.join('، ')})`}</span>)}</div>
                </div>
              )}
              {t.classification.activities&&t.classification.activities.length>0&&(
                <div className="sm:col-span-2"><div className="text-xs font-semibold mb-1" style={{color:'var(--text-3)'}}>الأنشطة</div>
                  <div className="flex flex-wrap gap-1.5">{t.classification.activities.map(a=><span key={a} className="badge badge-gray text-[11px]">{a}</span>)}</div>
                </div>
              )}
              <Field label="تفاصيل" value={t.classification.details}/>
            </div>
          </Section>}

          {/* Bidders */}
          {t.bidders&&t.bidders.length>0&&<Section title="مقدمو العروض" icon="👥" count={t.bidders.length}>
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead><tr className="text-xs" style={{color:'var(--text-3)'}}><th className="text-right pb-2 font-semibold">المورد</th><th className="text-right pb-2 font-semibold">العرض المالي</th><th className="text-right pb-2 font-semibold">النتيجة الفنية</th></tr></thead>
              <tbody>{t.bidders.map((b:TenderBidder,i:number)=>(
                <tr key={i} className="table-row-hover" style={{borderTop:'1px solid var(--border)'}}>
                  <td className="py-2.5 font-medium" style={{color:'var(--text)'}}>{b.supplier_name}</td>
                  <td className="py-2.5 font-mono text-xs" style={{direction:'ltr',textAlign:'right'}}>{fmtSar(b.financial_offer)}</td>
                  <td className="py-2.5">{b.technical_result&&<span className={`badge text-[11px] ${b.technical_result==='مطابق'?'badge-green':'badge-red'}`}>{b.technical_result}</span>}</td>
                </tr>))}</tbody>
            </table></div>
          </Section>}

          {/* Awarded */}
          {t.awarded&&t.awarded.length>0&&<Section title="الترسيات" icon="🏆" defaultOpen count={t.awarded.length}>
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead><tr className="text-xs" style={{color:'var(--text-3)'}}><th className="text-right pb-2 font-semibold">المورد</th><th className="text-right pb-2 font-semibold">العرض المالي</th><th className="text-right pb-2 font-semibold">قيمة الترسية</th></tr></thead>
              <tbody>{t.awarded.map((a:TenderAwarded,i:number)=>(
                <tr key={i} className="table-row-hover" style={{borderTop:'1px solid var(--border)'}}>
                  <td className="py-2.5 font-medium" style={{color:'var(--success)'}}>{a.supplier_name}</td>
                  <td className="py-2.5 font-mono text-xs" style={{direction:'ltr',textAlign:'right'}}>{fmtSar(a.financial_offer)}</td>
                  <td className="py-2.5 font-mono text-xs font-bold" style={{color:'var(--success)',direction:'ltr',textAlign:'right'}}>{fmtSar(a.awarded_value)}</td>
                </tr>))}</tbody>
            </table></div>
          </Section>}

          {/* Local Content */}
          {t.local_content_requirement&&<Section title="المحتوى المحلي" icon="🇸🇦">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <Field label="نسبة المحتوى المحلي المستهدفة" value={t.local_content_requirement.target_local_content_percent?`${t.local_content_requirement.target_local_content_percent}%`:undefined}/>
              <Field label="الحد الأدنى" value={t.local_content_requirement.baseline_min_text}/>
              {t.local_content_requirement.mechanisms&&t.local_content_requirement.mechanisms.length>0&&(
                <div className="sm:col-span-2"><div className="text-xs font-semibold mb-1" style={{color:'var(--text-3)'}}>آليات المحتوى المحلي</div>
                  <div className="flex flex-wrap gap-1.5">{t.local_content_requirement.mechanisms.map(m=><span key={m} className="badge badge-green text-[11px]">{m}</span>)}</div>
                </div>
              )}
            </div>
          </Section>}

          {/* Documents */}
          {t.local_docs&&t.local_docs.length>0&&<Section title="المستندات" icon="📄" count={t.local_docs.length}>
            <div className="space-y-2">{t.local_docs.map((d,i)=>(
              <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg transition-colors hover:bg-slate-50" style={{background:'var(--surface-dim)',color:'var(--accent)'}}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <span className="text-sm">{d.title}</span>
              </a>
            ))}</div>
          </Section>}

          {/* Status History */}
          {t.status_history&&t.status_history.length>0&&<Section title="سجل تغييرات الحالة" icon="📊" count={t.status_history.length}>
            <div className="space-y-2">{t.status_history.map((h,i)=>(
              <div key={i} className="flex items-center justify-between py-2" style={{borderBottom:i<t.status_history!.length-1?'1px solid var(--border)':'none'}}>
                <span className="text-sm" style={{color:'var(--text)'}}>{h.status||'—'}</span>
                <span className="text-xs font-mono" style={{color:'var(--text-3)'}}>{fmtDateTime(h.changed_at)}</span>
              </div>))}</div>
          </Section>}

          {/* Field Changes */}
          {t.field_changes&&t.field_changes.length>0&&<Section title="سجل تغييرات الحقول" icon="✏️" count={t.field_changes.length}>
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead><tr className="text-xs" style={{color:'var(--text-3)'}}><th className="text-right pb-2 font-semibold">الحقل</th><th className="text-right pb-2 font-semibold">القيمة القديمة</th><th className="text-right pb-2 font-semibold">القيمة الجديدة</th><th className="text-right pb-2 font-semibold">التاريخ</th></tr></thead>
              <tbody>{t.field_changes.map((fc,i)=>(
                <tr key={i} className="table-row-hover" style={{borderTop:'1px solid var(--border)'}}>
                  <td className="py-2 font-medium">{fc.field_name}</td>
                  <td className="py-2 text-xs" style={{color:'var(--danger)'}}>{fc.old_value||'—'}</td>
                  <td className="py-2 text-xs" style={{color:'var(--success)'}}>{fc.new_value||'—'}</td>
                  <td className="py-2 text-xs font-mono" style={{color:'var(--text-3)'}}>{fmtDateTime(fc.changed_at)}</td>
                </tr>))}</tbody>
            </table></div>
          </Section>}
        </div>
      </div>
    </div>
  );
}
