'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getTenders, getAllTenderIds, getTenderDetailsBatch } from '@/lib/api';
import type { TenderSearchMode, TenderListParams, Tender, TenderMin } from '@/types';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';

const SEARCH_MODE_INFO: Record<TenderSearchMode, { label: string; help: string }> = {
  tokens: { label: 'كلمات', help: 'جميع الكلمات يجب أن تظهر (بأي ترتيب)' },
  smart:  { label: 'ذكي', help: 'بحث بالنص الكامل في جميع الحقول' },
  phrase: { label: 'عبارة', help: 'مطابقة العبارة بالضبط مع حدود الكلمات' },
};
// Grouped by lifecycle stage for the dropdown
const STATUS_GROUPS: {label:string;statuses:string[]}[] = [
  { label: '── متاحة للتقديم ──', statuses: [
    'قبول العروض',
    'مرحلة المزايدة المباشرة',
  ]},
  { label: '── تحت التقييم ──', statuses: [
    'تقييم العروض',
    'بإنتظار إعتماد تقرير فتح العروض الفنية',
    'بانتظار اعتماد تقييم العروض المالية',
  ]},
  { label: '── بانتظار الترسية ──', statuses: [
    'في انتظار الترسية',
    'بإنتظار موافقة لجنة الإستثناء',
    'معادة للترسية بسبب قبول طلب التظلم',
  ]},
  { label: '── تمت الترسية ──', statuses: [
    'تمت الترسية',
    'تم اعتماد الترسية',
  ]},
  { label: '── منتهية ──', statuses: [
    'انتهاء المنافسة',
    'انتهاء المزايدة المباشرة',
    'تحت الانشاء انقضاء مدة ادخال القيمة التقديرية',
  ]},
  { label: '── ملغاة / مرفوضة ──', statuses: [
    'تم إلغاء المنافسة',
    'تم رفض تقرير فتح العروض',
  ]},
];
const ALL_STATUSES = STATUS_GROUPS.flatMap(g => g.statuses);

// Status → color/style mapping
type StatusGroup = 'active'|'evaluation'|'pending'|'awarded'|'ended'|'cancelled';
function classifyStatus(s:string|undefined): StatusGroup {
  if(!s) return 'ended';
  // Active: can submit bids now
  if(s==='قبول العروض'||s==='مرحلة المزايدة المباشرة') return 'active';
  // Evaluation: bids closed, under review
  if(s==='تقييم العروض'||s==='بإنتظار إعتماد تقرير فتح العروض الفنية'||s==='بانتظار اعتماد تقييم العروض المالية') return 'evaluation';
  // Pending: waiting for award decision
  if(s==='في انتظار الترسية'||s==='بإنتظار موافقة لجنة الإستثناء'||s==='معادة للترسية بسبب قبول طلب التظلم') return 'pending';
  // Awarded: winner selected/approved
  if(s==='تمت الترسية'||s==='تم اعتماد الترسية') return 'awarded';
  // Cancelled/Rejected
  if(s==='تم إلغاء المنافسة'||s==='تم رفض تقرير فتح العروض') return 'cancelled';
  // Ended: finished
  return 'ended';
}
const STATUS_STYLES: Record<StatusGroup,{bg:string;color:string;cls:string;dot:string}> = {
  active:     {bg:'var(--brand-lighter)',color:'var(--brand)',cls:'status-active',dot:'#3b82f6'},
  evaluation: {bg:'var(--warn-bg)',color:'var(--warn)',cls:'status-evaluation',dot:'#f59e0b'},
  pending:    {bg:'#fef3c7',color:'#92400e',cls:'status-evaluation',dot:'#d97706'},
  awarded:    {bg:'var(--success-bg)',color:'var(--success)',cls:'status-awarded',dot:'#22c55e'},
  ended:      {bg:'#f1f5f9',color:'var(--text-3)',cls:'',dot:'#94a3b8'},
  cancelled:  {bg:'var(--danger-bg)',color:'var(--danger)',cls:'status-cancelled',dot:'#ef4444'},
};
function statusStyle(s:string|undefined): {bg:string;color:string;cls:string} {
  if(!s) return {bg:'#f1f5f9',color:'var(--text-3)',cls:''};
  const st=STATUS_STYLES[classifyStatus(s)];
  return {bg:st.bg,color:st.color,cls:st.cls};
}
const DATE_FILTERS: { key: string; fromKey: string; toKey: string; label: string; isDatetime?: boolean }[] = [
  { key: 'publish_date', fromKey: 'publish_date_from', toKey: 'publish_date_to', label: 'تاريخ النشر' },
  { key: 'bid_submission', fromKey: 'bid_submission_deadline_at_from', toKey: 'bid_submission_deadline_at_to', label: 'آخر موعد لتقديم العروض', isDatetime: true },
  { key: 'expected_award', fromKey: 'expected_award_date_from', toKey: 'expected_award_date_to', label: 'تاريخ الترسية المتوقع' },
  { key: 'work_start', fromKey: 'work_start_date_from', toKey: 'work_start_date_to', label: 'تاريخ بدء العمل' },
  { key: 'inquiries_deadline', fromKey: 'inquiries_deadline_date_from', toKey: 'inquiries_deadline_date_to', label: 'آخر موعد للاستفسارات' },
  { key: 'bid_evaluation', fromKey: 'bid_evaluation_date_from', toKey: 'bid_evaluation_date_to', label: 'تاريخ تقييم العروض' },
  { key: 'questions_start', fromKey: 'questions_start_date_from', toKey: 'questions_start_date_to', label: 'تاريخ بدء الأسئلة' },
  { key: 'bid_opening', fromKey: 'bid_opening_at_from', toKey: 'bid_opening_at_to', label: 'تاريخ فتح المظاريف', isDatetime: true },
];
const MAX_ANALYTICS_TENDERS = 500;
const FILTER_KEYS = ['competition_status','awarding_published',...DATE_FILTERS.flatMap(d=>[d.fromKey,d.toKey])];
const CUSTOM_FILTER_KEYS = ['agency_search','region_search','activity_search'];
const SAUDI_REGIONS = ['الرياض','مكة المكرمة','المدينة المنورة','المنطقة الشرقية','القصيم','حائل','تبوك','الحدود الشمالية','جازان','نجران','الباحة','الجوف','عسير'];
const COMMON_ACTIVITIES = [
  'تقنية المعلومات','البرمجيات','الأنظمة','الشبكات','الأمن السيبراني','الاتصالات',
  'إنشاءات','مقاولات','تشييد','بناء','ترميم','هدم وإزالة',
  'صيانة','تشغيل','نظافة','تأثيث','أثاث مكتبي',
  'استشارات','دراسات','تصاميم هندسية','إشراف',
  'نقل','سيارات','مركبات','وقود',
  'أمن وسلامة','حراسة','كاميرات مراقبة',
  'طباعة','مطبوعات','لوحات إعلانية',
  'تدريب','تأهيل','موارد بشرية',
  'أغذية','تغذية','إعاشة','ضيافة',
  'معدات طبية','أجهزة طبية','مستلزمات طبية','أدوية',
  'كهرباء','تكييف','سباكة','مصاعد',
  'زراعة','تشجير','حدائق',
  'مختبرات','فحص','اختبارات',
];

function fmtDate(d: string|undefined|null) { if(!d) return '—'; try { return format(parseISO(d),'d MMM yyyy',{locale:ar}); } catch { return d; } }
function fmtNum(n: number): string { return n.toLocaleString('en-US'); }
function fmtSarShort(n: number): string { if(n>=1_000_000_000) return fmtNum(Math.round(n/1_000_000_000*10)/10)+' مليار'; if(n>=1_000_000) return fmtNum(Math.round(n/1_000_000*10)/10)+' م'; if(n>=1_000) return fmtNum(Math.round(n/1_000))+' ألف'; return fmtNum(Math.round(n)); }
function fmtSar(a: string|undefined|null): string { if(!a) return '—'; const n=parseFloat(a); if(isNaN(n)) return a; return n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' ر.س'; }
function fmtSarFull(a: string|undefined|null): string { if(!a) return '—'; const n=parseFloat(a); if(isNaN(n)) return a; return n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' ريال سعودي'; }
function highlightText(text: string, query: string): React.ReactNode {
  if(!query||!text) return text;
  const words=query.split(/\s+/).filter(w=>w.length>1); if(words.length===0) return text;
  const regex=new RegExp(`(${words.map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`,'gi');
  const parts=text.split(regex);
  return parts.map((part,i)=>regex.test(part)?<mark key={i} className="search-hl">{part}</mark>:part);
}
// Icons
const SearchIcon=({c='w-4 h-4'}:{c?:string})=><svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>;
const FilterIcon=({c='w-4 h-4'}:{c?:string})=><svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>;
const ChartIcon=({c='w-4 h-4'}:{c?:string})=><svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>;
const XIcon=({c='w-4 h-4'}:{c?:string})=><svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>;
const ChevronIcon=({c='w-4 h-4',dir='down'}:{c?:string;dir?:string})=>{const r:Record<string,number>={up:180,down:0,left:-90,right:90};return <svg className={c} style={{transform:`rotate(${r[dir]||0}deg)`,transition:'transform 200ms'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>;};
const BuildingIcon=({c='w-4 h-4'}:{c?:string})=><svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>;
const MapIcon=({c='w-4 h-4'}:{c?:string})=><svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const CalendarIcon=({c='w-3.5 h-3.5'}:{c?:string})=><svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>;
const ClockIcon=({c='w-3.5 h-3.5'}:{c?:string})=><svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const TagIcon=({c='w-3.5 h-3.5'}:{c?:string})=><svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>;
const SarIcon=({c='w-3.5 h-3.5'}:{c?:string})=><svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const ExternalIcon=({c='w-3.5 h-3.5'}:{c?:string})=><svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>;
const ArrowUpIcon=()=><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>;
// SearchableDropdown
function SearchableDropdown({label,icon,value,onChange,options,placeholder}:{label:string;icon?:React.ReactNode;value:string;onChange:(v:string)=>void;options:string[];placeholder:string;}) {
  const [open,setOpen]=useState(false); const [query,setQuery]=useState(''); const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{const h=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node)){setOpen(false);if(query&&!value)onChange(query);}};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[query,value,onChange]);
  const filtered=useMemo(()=>!query?options:options.filter(o=>o.includes(query)),[options,query]);
  const handleKeyDown=(e:React.KeyboardEvent)=>{if(e.key==='Enter'){e.preventDefault();if(query){onChange(query);setOpen(false);}}};
  return (<div ref={ref} className="relative"><label className="label"><span className="flex items-center gap-1">{icon}{label}</span></label><div className="relative"><input type="text" value={value||query} onChange={e=>{const v=e.target.value;if(value){onChange('');setQuery(v);}else{setQuery(v);}setOpen(true);}} onFocus={()=>setOpen(true)} onKeyDown={handleKeyDown} placeholder={placeholder} className="input pl-8"/><SearchIcon c="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"/>{(value||query)&&<button type="button" onClick={()=>{onChange('');setQuery('');}} className="absolute left-7 top-1/2 -translate-y-1/2" style={{color:'var(--text-3)'}}><XIcon c="w-3 h-3"/></button>}</div>{open&&filtered.length>0&&(<div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border bg-white" style={{borderColor:'var(--border)',boxShadow:'var(--shadow-lg)'}}>{filtered.slice(0,50).map(opt=>(<button key={opt} type="button" onClick={()=>{onChange(opt);setQuery('');setOpen(false);}} className="w-full text-right px-3 py-2 text-sm transition-colors hover:bg-slate-50" style={{color:opt===value?'var(--brand)':'var(--text)',fontWeight:opt===value?600:400}}>{opt}</button>))}</div>)}</div>);
}

// Header
function Header() {
  const {user,logout}=useAuth();
  const router=useRouter();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b" style={{borderColor:'var(--border)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex justify-between items-center h-14">
        <div className="flex items-center gap-3 cursor-pointer" onClick={()=>router.push('/')}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{background:'linear-gradient(135deg, var(--brand), var(--accent))'}}>م</div>
          <h1 className="text-lg font-semibold" style={{color:'var(--text)'}}>بوابة المنافسات</h1>
        </div>
        <div className="flex items-center gap-3">
          {user&&(<div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:'var(--accent)'}}>{(user.username||'U')[0].toUpperCase()}</div><span className="text-sm hidden sm:inline" style={{color:'var(--text-2)'}}>{user.username}</span></div>)}
          <button onClick={logout} className="btn-ghost btn-sm" style={{color:'var(--danger)'}}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </div></div>
    </header>
  );
}

// ScrollToTop
function ScrollToTop() {
  const [v,setV]=useState(false);
  useEffect(()=>{const h=()=>setV(window.scrollY>400);window.addEventListener('scroll',h,{passive:true});return()=>window.removeEventListener('scroll',h);},[]);
  return <button className={`scroll-top-btn ${v?'visible':''}`} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}><ArrowUpIcon/></button>;
}

// TenderCard with lazy-loaded award info
function TenderCard({t,searchQuery,onClick,index,awardInfo}:{t:TenderMin;searchQuery:string;onClick:()=>void;index:number;awardInfo?:{supplier:string;value:string}|null}) {
  const ss=statusStyle(t.competition_status);
  const docPrice=t.documents_price_sar;
  const isFree=docPrice==='0'||docPrice==='0.00';
  return (
    <div className={`tender-card ${ss.cls} cursor-pointer animate-fadeIn`} onClick={onClick} style={{animationDelay:`${index*30}ms`}}>
      <div className="tender-card-body">
        {/* Row 1: Type + Date + Status */}
        <div className="flex items-start justify-between gap-3 mb-2"><div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {t.tender_type&&<span className="badge badge-blue text-[11px]">{t.tender_type}</span>}
            {t.publish_date&&<span className="text-xs flex items-center gap-1" style={{color:'var(--text-3)'}}><CalendarIcon c="w-3 h-3"/> تاريخ النشر: {fmtDate(t.publish_date)}</span>}
          </div>
          {/* Title */}
          <h3 className="text-[15px] font-bold leading-relaxed" style={{color:'var(--text)'}}>{highlightText(t.name,searchQuery)}</h3>
        </div>
        {t.competition_status&&<span className="badge flex-shrink-0 text-[11px]" style={{background:ss.bg,color:ss.color}}>{t.competition_status}</span>}
        </div>

        {/* Agency */}
        {t.agency_name&&(<div className="flex items-center gap-1.5 mt-2" style={{color:'var(--text-2)'}}><BuildingIcon c="w-3.5 h-3.5 flex-shrink-0"/><span className="text-xs font-medium">{highlightText(t.agency_name,searchQuery)}</span></div>)}

        {/* Award banner — shows when tender has published awarding */}
        {awardInfo&&(
          <div className="mt-3 flex items-center gap-3 p-2.5 rounded-lg" style={{background:'var(--success-bg)',border:'1px solid #bbf7d0'}}>
            <span className="text-base">🏆</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold" style={{color:'var(--success)'}}>المورد الفائز: <span style={{color:'var(--text)'}}>{awardInfo.supplier}</span></div>
              <div className="text-xs font-bold font-mono mt-0.5" style={{color:'var(--success)',direction:'ltr',textAlign:'right'}}>{fmtSar(awardInfo.value)}</div>
            </div>
          </div>
        )}
        {t.awarding_published&&!awardInfo&&awardInfo!==null&&(
          <div className="mt-3 flex items-center gap-2 p-2 rounded-lg" style={{background:'var(--success-bg)'}}>
            <div className="w-3 h-3 rounded-full border-2 border-transparent animate-spin" style={{borderTopColor:'var(--success)',borderLeftColor:'var(--success)'}}/>
            <span className="text-[11px]" style={{color:'var(--success)'}}>جاري تحميل بيانات الترسية...</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="tender-card-footer">
        {t.reference_number&&<div className="tender-card-footer-item"><TagIcon/><span className="font-mono text-[12px]" style={{direction:'ltr',letterSpacing:'0.5px'}}>{t.reference_number}</span></div>}
        {docPrice&&<div className="tender-card-footer-item"><SarIcon/><span className="font-medium">{isFree?<span style={{color:'var(--success)'}}>مجاناً</span>:<span className="font-mono" style={{direction:'ltr'}}>{fmtSar(docPrice)}</span>}</span></div>}
        {t.remaining_time_text&&<div className="tender-card-footer-item"><ClockIcon/><span>{t.remaining_time_text}</span></div>}
        {t.details_url&&<a href={t.details_url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} className="tender-card-footer-item mr-auto transition-colors hover:text-sky-600" style={{color:'var(--accent)'}}><ExternalIcon/><span>اعتماد</span></a>}
      </div>
    </div>
  );
}

function CardSkeleton() { return <div className="space-y-3">{Array.from({length:5}).map((_,i)=><div key={i} className="card p-5 space-y-3"><div className="flex gap-2"><div className="skeleton h-5 w-20"/><div className="skeleton h-5 w-28"/></div><div className="skeleton h-6 w-3/4"/><div className="skeleton h-4 w-1/2"/><div className="flex gap-6 mt-2"><div className="skeleton h-4 w-32"/><div className="skeleton h-4 w-24"/></div></div>)}</div>; }
// Analytics
interface SupplierProfile {
  name:string; awardCount:number; bidCount:number; totalAwarded:number; avgAwarded:number;
  maxAwarded:number; minAwarded:number; winRate:number;
  agencies:string[]; tenders:{id:string;name:string;value:number;agency:string}[];
}
interface ActivityBreakdown { name:string; count:number; totalValue:number; avgValue:number; tenders:{id:string;name:string;value:number}[]; }
interface AnalyticsData {
  totalTenders:number;searchTotal:number;totalAwarded:number;totalAwardedValue:number;avgAwardedValue:number;
  maxAwardedValue:number;minAwardedValue:number;
  maxTender:{name:string;value:number;id:string}|null;minTender:{name:string;value:number;id:string}|null;
  technicalPassRate:number;totalBidders:number;totalTechnicalPass:number;
  supplierTop:{name:string;count:number;totalValue:number;tenders:{id:string;name:string;value:number}[]}[];
  agencyTop:{name:string;count:number;totalValue:number;avgValue:number;tenders:{id:string;name:string;value:number}[]}[];
  supplierProfiles:SupplierProfile[];
  activityBreakdown:ActivityBreakdown[];
  knownActivities:string[];
  avgBiddersPerTender:number;
  priceAnalysis:{avgDiscount:number;tenderCount:number};
}

function computeAnalytics(details:Tender[],searchTotal:number):AnalyticsData {
  let totalAwardedValue=0,maxVal=-Infinity,minVal=Infinity,awardCount=0;
  let maxT:AnalyticsData['maxTender']=null,minT:AnalyticsData['minTender']=null;
  let totalBidders=0,totalTechPass=0,tenderWithBidders=0;
  let discountSum=0,discountCount=0;
  const supplierMap:Record<string,{count:number;totalValue:number;tenders:{id:string;name:string;value:number}[]}> = {};
  const agencyMap:Record<string,{count:number;totalValue:number;tenders:{id:string;name:string;value:number}[]}> = {};
  // Extended: supplier profiles (bid + award tracking)
  const spMap:Record<string,{bidCount:number;awardCount:number;totalAwarded:number;maxAw:number;minAw:number;agencies:Set<string>;tenders:{id:string;name:string;value:number;agency:string}[]}> = {};
  // Extended: activity breakdown
  const actMap:Record<string,{count:number;totalValue:number;tenders:{id:string;name:string;value:number}[]}> = {};
  const allActivities=new Set<string>();

  for(const t of details){
    const agencyName=t.agency_name||'غير محدد';
    // Collect activities
    if(t.classification?.activities) for(const act of t.classification.activities) allActivities.add(act);

    // Track bidders (for supplier profile bid count)
    if(t.bidders&&t.bidders.length>0){
      totalBidders+=t.bidders.length; tenderWithBidders++;
      totalTechPass+=t.bidders.filter(b=>b.technical_result==='مطابق').length;
      for(const b of t.bidders){
        if(!spMap[b.supplier_name]) spMap[b.supplier_name]={bidCount:0,awardCount:0,totalAwarded:0,maxAw:0,minAw:Infinity,agencies:new Set(),tenders:[]};
        spMap[b.supplier_name].bidCount++;
      }
    }

    if(t.awarded) for(const a of t.awarded){
      const v=parseFloat(a.awarded_value||'0');
      if(v>0){
        totalAwardedValue+=v;awardCount++;
        if(v>maxVal){maxVal=v;maxT={name:t.name,value:v,id:t.id};}
        if(v<minVal){minVal=v;minT={name:t.name,value:v,id:t.id};}
        // Price discount analysis
        const fo=parseFloat(a.financial_offer||'0');
        if(fo>0&&v>0){const disc=((fo-v)/fo)*100; if(Math.abs(disc)<100){discountSum+=disc;discountCount++;}}

        const sn=a.supplier_name;
        if(!supplierMap[sn]) supplierMap[sn]={count:0,totalValue:0,tenders:[]};
        supplierMap[sn].count++;supplierMap[sn].totalValue+=v;supplierMap[sn].tenders.push({id:t.id,name:t.name,value:v});
        if(!agencyMap[agencyName]) agencyMap[agencyName]={count:0,totalValue:0,tenders:[]};
        agencyMap[agencyName].count++;agencyMap[agencyName].totalValue+=v;agencyMap[agencyName].tenders.push({id:t.id,name:t.name,value:v});

        // Supplier profile award tracking
        if(!spMap[sn]) spMap[sn]={bidCount:0,awardCount:0,totalAwarded:0,maxAw:0,minAw:Infinity,agencies:new Set(),tenders:[]};
        spMap[sn].awardCount++;spMap[sn].totalAwarded+=v;
        if(v>spMap[sn].maxAw) spMap[sn].maxAw=v;
        if(v<spMap[sn].minAw) spMap[sn].minAw=v;
        spMap[sn].agencies.add(agencyName);
        spMap[sn].tenders.push({id:t.id,name:t.name,value:v,agency:agencyName});

        // Activity breakdown for awarded tenders
        if(t.classification?.activities) for(const act of t.classification.activities){
          if(!actMap[act]) actMap[act]={count:0,totalValue:0,tenders:[]};
          actMap[act].count++;actMap[act].totalValue+=v;actMap[act].tenders.push({id:t.id,name:t.name,value:v});
        }
      }
    }
  }

  const supplierProfiles:SupplierProfile[]=Object.entries(spMap)
    .filter(([,d])=>d.awardCount>0)
    .map(([name,d])=>({
      name,awardCount:d.awardCount,bidCount:d.bidCount,totalAwarded:d.totalAwarded,
      avgAwarded:d.awardCount>0?d.totalAwarded/d.awardCount:0,
      maxAwarded:d.maxAw,minAwarded:d.minAw===Infinity?0:d.minAw,
      winRate:d.bidCount>0?(d.awardCount/d.bidCount)*100:0,
      agencies:Array.from(d.agencies),tenders:d.tenders,
    })).sort((a,b)=>b.totalAwarded-a.totalAwarded);

  const activityBreakdown:ActivityBreakdown[]=Object.entries(actMap)
    .map(([name,d])=>({name,count:d.count,totalValue:d.totalValue,avgValue:d.count>0?d.totalValue/d.count:0,tenders:d.tenders}))
    .sort((a,b)=>b.totalValue-a.totalValue);

  return {totalTenders:details.length,searchTotal,totalAwarded:awardCount,totalAwardedValue,
    avgAwardedValue:awardCount>0?totalAwardedValue/awardCount:0,
    maxAwardedValue:maxVal===-Infinity?0:maxVal,minAwardedValue:minVal===Infinity?0:minVal,
    maxTender:maxT,minTender:minT,technicalPassRate:totalBidders>0?(totalTechPass/totalBidders)*100:0,totalBidders,totalTechnicalPass:totalTechPass,
    supplierTop:Object.entries(supplierMap).map(([name,d])=>({name,...d})).sort((a,b)=>b.totalValue-a.totalValue).slice(0,10),
    agencyTop:Object.entries(agencyMap).map(([name,d])=>({name,...d,avgValue:d.count>0?d.totalValue/d.count:0})).sort((a,b)=>b.totalValue-a.totalValue).slice(0,10),
    supplierProfiles,activityBreakdown,knownActivities:Array.from(allActivities).sort(),
    avgBiddersPerTender:tenderWithBidders>0?totalBidders/tenderWithBidders:0,
    priceAnalysis:{avgDiscount:discountCount>0?discountSum/discountCount:0,tenderCount:discountCount},
  };
}

function DrillDownModal({title,tenders,onClose,onTenderClick}:{title:string;tenders:{id:string;name:string;value:number}[];onClose:()=>void;onTenderClick:(id:string)=>void;}) {
  useEffect(()=>{const h=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();};window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h);},[onClose]);
  return (<div className="modal-overlay" onClick={onClose}><div className="modal-content animate-fadeIn" onClick={e=>e.stopPropagation()}>
    <div className="modal-header"><h3 className="text-sm font-bold" style={{color:'var(--text)'}}>{title}</h3><button onClick={onClose} className="btn-ghost btn-sm p-1"><XIcon/></button></div>
    <div className="modal-body"><div className="text-xs mb-3" style={{color:'var(--text-3)'}}>{tenders.length} ترسية</div>
      <div className="space-y-2">{tenders.map((t,i)=>(
        <div key={`${t.id}-${i}`} onClick={()=>onTenderClick(t.id)} className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-slate-50" style={{background:'var(--surface-dim)'}}>
          <span className="text-sm flex-1 ml-4 line-clamp-2" style={{color:'var(--text)'}}>{t.name}</span>
          <span className="text-xs font-mono font-bold flex-shrink-0" style={{color:'var(--brand)',direction:'ltr'}}>{fmtSarShort(t.value)} ر.س</span>
        </div>))}</div>
    </div></div></div>);
}

function BarChart({items,valueKey,subLabel,onItemClick}:{items:{name:string;[k:string]:unknown}[];valueKey:string;subLabel?:string;onItemClick?:(item:{name:string;[k:string]:unknown})=>void;}) {
  if(!items.length) return null; const maxV=Math.max(...items.map(i=>i[valueKey] as number));
  return (<div className="space-y-3">{items.map((s,i)=>(
    <div key={s.name} className={`flex items-center gap-3 animate-fadeIn ${onItemClick?'cursor-pointer group':''}`} style={{animationDelay:`${i*40}ms`}} onClick={()=>onItemClick?.(s)}>
      <div className="w-5 text-left text-xs font-medium" style={{color:'var(--text-3)',fontFamily:"'IBM Plex Mono',monospace"}}>{i+1}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1 gap-2">
          <div className={`text-sm truncate ${onItemClick?'group-hover:text-sky-600 transition-colors':''}`} style={{color:'var(--text)'}} title={s.name}>{s.name}</div>
          <span className="text-xs font-bold whitespace-nowrap flex-shrink-0" style={{color:'var(--brand)',fontFamily:"'IBM Plex Mono',monospace"}}>{fmtSarShort(s[valueKey] as number)} ر.س</span>
        </div>
        <div className="h-4 rounded-md overflow-hidden" style={{background:'var(--surface-dim)'}}>
          <div className="h-full rounded-md transition-all duration-700" style={{width:`${Math.max(((s[valueKey] as number)/maxV)*100,4)}%`,background:'linear-gradient(90deg, #0891b2, #0ea5e9)'}}/>
        </div>
      </div>
      <div className="text-xs font-medium w-14 text-left whitespace-nowrap" style={{color:'var(--text-2)'}}>{s.count as number} {subLabel||'ترسية'}</div>
    </div>))}</div>);
}
// Supplier Comparison Modal
function SupplierComparisonModal({profiles,onClose,onTenderClick}:{profiles:SupplierProfile[];onClose:()=>void;onTenderClick:(id:string)=>void}) {
  const [search,setSearch]=useState('');
  const [sortKey,setSortKey]=useState<'totalAwarded'|'awardCount'|'winRate'|'avgAwarded'>('totalAwarded');
  const [expanded,setExpanded]=useState<string|null>(null);
  useEffect(()=>{const h=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();};window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h);},[onClose]);

  const filtered=useMemo(()=>{
    let list=profiles;
    if(search) list=list.filter(p=>p.name.includes(search));
    return [...list].sort((a,b)=>(b[sortKey] as number)-(a[sortKey] as number));
  },[profiles,search,sortKey]);

  const sortBtns:[typeof sortKey,string][]=[['totalAwarded','الإجمالي'],['awardCount','عدد الترسيات'],['winRate','نسبة الفوز'],['avgAwarded','المتوسط']];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fadeIn" style={{maxWidth:900,maxHeight:'90vh'}} onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="text-sm font-bold" style={{color:'var(--text)'}}>📊 مقارنة أداء الموردين</h3>
          <button onClick={onClose} className="btn-ghost btn-sm p-1"><XIcon/></button>
        </div>
        <div className="px-5 pt-3 pb-2 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center" style={{borderBottom:'1px solid var(--border)'}}>
          <div className="flex-1 relative">
            <SearchIcon c="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"/>
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عن مورد..." className="input pr-8 text-sm" style={{padding:'0.375rem 0.75rem',paddingRight:'2rem'}}/>
          </div>
          <div className="flex gap-1 flex-wrap">
            {sortBtns.map(([k,label])=>(
              <button key={k} onClick={()=>setSortKey(k)} className="px-2.5 py-1 text-xs font-medium rounded-md transition-colors"
                style={{background:sortKey===k?'var(--brand)':'var(--surface-dim)',color:sortKey===k?'#fff':'var(--text-2)'}}>{label}</button>
            ))}
          </div>
        </div>
        <div className="modal-body">
          <div className="text-xs mb-3" style={{color:'var(--text-3)'}}>{filtered.length} مورد</div>
          <div className="space-y-2">
            {filtered.slice(0,50).map((sp,idx)=>{
              const isExp=expanded===sp.name;
              return (
                <div key={sp.name} className="rounded-lg overflow-hidden animate-fadeIn" style={{background:'var(--surface-dim)',animationDelay:`${idx*20}ms`}}>
                  <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={()=>setExpanded(isExp?null:sp.name)}>
                    <div className="w-6 text-center text-xs font-bold" style={{color:'var(--text-3)',fontFamily:"'IBM Plex Mono',monospace"}}>{idx+1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate" style={{color:'var(--text)'}} title={sp.name}>{sp.name}</div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span className="text-[11px]" style={{color:'var(--text-3)'}}>ترسيات: <span className="font-bold" style={{color:'var(--brand)'}}>{sp.awardCount}</span></span>
                        <span className="text-[11px]" style={{color:'var(--text-3)'}}>تقديم: <span className="font-bold" style={{color:'var(--text-2)'}}>{sp.bidCount}</span></span>
                        <span className="text-[11px]" style={{color:'var(--text-3)'}}>نسبة الفوز: <span className="font-bold" style={{color:sp.winRate>=50?'var(--success)':'var(--warn)'}}>{sp.winRate.toFixed(0)}%</span></span>
                      </div>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <div className="text-xs font-bold font-mono" style={{color:'var(--brand)',direction:'ltr'}}>{fmtSarShort(sp.totalAwarded)} ر.س</div>
                      <div className="text-[10px]" style={{color:'var(--text-3)'}}>متوسط: {fmtSarShort(sp.avgAwarded)}</div>
                    </div>
                    <ChevronIcon c="w-4 h-4 flex-shrink-0" dir={isExp?'up':'down'}/>
                  </div>
                  {isExp&&(
                    <div className="px-3 pb-3 animate-fadeIn">
                      {/* Stats row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                        <div className="p-2 rounded-md bg-white"><div className="text-[10px]" style={{color:'var(--text-3)'}}>أعلى ترسية</div><div className="text-xs font-bold font-mono" style={{color:'var(--success)',direction:'ltr'}}>{fmtSarShort(sp.maxAwarded)} ر.س</div></div>
                        <div className="p-2 rounded-md bg-white"><div className="text-[10px]" style={{color:'var(--text-3)'}}>أقل ترسية</div><div className="text-xs font-bold font-mono" style={{color:'var(--warn)',direction:'ltr'}}>{fmtSarShort(sp.minAwarded)} ر.س</div></div>
                        <div className="p-2 rounded-md bg-white"><div className="text-[10px]" style={{color:'var(--text-3)'}}>عدد الجهات</div><div className="text-xs font-bold">{sp.agencies.length}</div></div>
                        <div className="p-2 rounded-md bg-white"><div className="text-[10px]" style={{color:'var(--text-3)'}}>نسبة الفوز</div><div className="text-xs font-bold" style={{color:sp.winRate>=50?'var(--success)':'var(--warn)'}}>{sp.winRate.toFixed(1)}%</div></div>
                      </div>
                      {/* Agencies */}
                      <div className="mb-2"><div className="text-[10px] font-semibold mb-1" style={{color:'var(--text-3)'}}>الجهات المتعامل معها:</div>
                        <div className="flex flex-wrap gap-1">{sp.agencies.slice(0,8).map(a=><span key={a} className="badge badge-blue text-[10px]">{a}</span>)}{sp.agencies.length>8&&<span className="badge badge-gray text-[10px]">+{sp.agencies.length-8}</span>}</div>
                      </div>
                      {/* Tenders list */}
                      <div className="text-[10px] font-semibold mb-1" style={{color:'var(--text-3)'}}>الترسيات:</div>
                      <div className="space-y-1 max-h-40 overflow-y-auto">{sp.tenders.map((t,i)=>(
                        <div key={`${t.id}-${i}`} onClick={e=>{e.stopPropagation();onTenderClick(t.id);}} className="flex items-center justify-between p-2 rounded-md bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                          <div className="flex-1 min-w-0 ml-3"><div className="text-xs truncate" style={{color:'var(--text)'}}>{t.name}</div><div className="text-[10px]" style={{color:'var(--text-3)'}}>{t.agency}</div></div>
                          <span className="text-[11px] font-mono font-bold flex-shrink-0" style={{color:'var(--brand)',direction:'ltr'}}>{fmtSarShort(t.value)} ر.س</span>
                        </div>
                      ))}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Activity Breakdown Chart
function ActivityChart({activities,onDrillDown}:{activities:ActivityBreakdown[];onDrillDown:(title:string,tenders:{id:string;name:string;value:number}[])=>void}) {
  if(!activities.length) return null;
  const maxV=Math.max(...activities.map(a=>a.totalValue));
  const colors=['#0891b2','#0ea5e9','#06b6d4','#0284c7','#0369a1','#155e75','#164e63','#22d3ee','#38bdf8','#7dd3fc'];
  return (
    <div className="space-y-2.5">
      {activities.slice(0,12).map((a,i)=>(
        <div key={a.name} className="cursor-pointer group animate-fadeIn" style={{animationDelay:`${i*30}ms`}} onClick={()=>onDrillDown(`نشاط: ${a.name}`,a.tenders)}>
          <div className="flex items-center justify-between mb-1 gap-2">
            <span className="text-sm truncate group-hover:text-sky-600 transition-colors" style={{color:'var(--text)'}} title={a.name}>{a.name}</span>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-[11px] font-mono font-bold" style={{color:'var(--brand)',direction:'ltr'}}>{fmtSarShort(a.totalValue)} ر.س</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-md" style={{background:'var(--surface-dim)',color:'var(--text-3)'}}>{a.count} ترسية</span>
            </div>
          </div>
          <div className="h-5 rounded-md overflow-hidden" style={{background:'var(--surface-dim)'}}>
            <div className="h-full rounded-md transition-all duration-700 group-hover:opacity-80" style={{width:`${Math.max((a.totalValue/maxV)*100,3)}%`,background:colors[i%colors.length]}}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsDashboard({stats,progress,isLoading,onDrillDown,onTenderClick}:{
  stats:AnalyticsData|null;progress:{phase:string;current:number;total:number};isLoading:boolean;
  onDrillDown:(title:string,tenders:{id:string;name:string;value:number}[])=>void;onTenderClick:(id:string)=>void;
}) {
  const [activeTab,setActiveTab]=useState<'overview'|'suppliers'|'activities'>('overview');
  const [showSupplierModal,setShowSupplierModal]=useState(false);

  if(isLoading) return (<div className="card p-6 mb-5 animate-fadeIn"><div className="flex items-center gap-4"><div className="w-6 h-6 rounded-full border-2 border-transparent animate-spin" style={{borderTopColor:'var(--accent)',borderLeftColor:'var(--accent)'}}/><div><p className="text-sm font-medium" style={{color:'var(--text)'}}>{progress.phase}</p><p className="text-xs" style={{color:'var(--text-3)'}}>{progress.current} من {progress.total}</p>{progress.total>0&&<div className="mt-2 h-1.5 w-48 rounded-full overflow-hidden" style={{background:'var(--surface-dim)'}}><div className="h-full rounded-full transition-all duration-300" style={{width:`${(progress.current/progress.total)*100}%`,background:'var(--accent)'}}/></div>}</div></div></div>);
  if(!stats||stats.totalTenders===0) return null; const s=stats;

  const tabs:[typeof activeTab,string,string][]=[['overview','📈','نظرة عامة'],['suppliers','👥','الموردين'],['activities','🏗️','الأنشطة']];

  return (
    <div className="space-y-4 mb-5 animate-fadeIn">
      {s.totalTenders<s.searchTotal&&<div className="text-xs text-center py-1.5 rounded-lg" style={{background:'var(--warn-bg)',color:'var(--warn)'}}>تم تحليل {s.totalTenders} من أصل {s.searchTotal} منافسة</div>}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg" style={{background:'var(--surface-dim)'}}>
        {tabs.map(([key,icon,label])=>(
          <button key={key} onClick={()=>setActiveTab(key)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-md transition-all"
            style={{background:activeTab===key?'var(--surface)':'transparent',color:activeTab===key?'var(--text)':'var(--text-3)',boxShadow:activeTab===key?'var(--shadow-sm)':'none'}}>
            <span>{icon}</span>{label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab==='overview'&&(<>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="stat-card"><div className="stat-label">إجمالي المنافسات</div><div className="stat-value">{fmtNum(s.searchTotal)}</div></div>
          <div className="stat-card"><div className="stat-label">إجمالي الترسيات</div><div className="stat-value text-base">{fmtSarShort(s.totalAwardedValue)} ر.س</div></div>
          <div className="stat-card"><div className="stat-label">متوسط الترسية</div><div className="stat-value text-base">{fmtSarShort(s.avgAwardedValue)} ر.س</div><div className="stat-sub">من {s.totalAwarded} ترسية</div></div>
          <div className="stat-card cursor-pointer hover:border-green-300 transition-colors" style={{borderColor:'var(--success)',borderWidth:'1px'}} onClick={()=>s.maxTender&&onTenderClick(s.maxTender.id)}>
            <div className="stat-label">أعلى ترسية</div><div className="stat-value text-base" style={{color:'var(--success)'}}>{fmtSarShort(s.maxAwardedValue)} ر.س</div>{s.maxTender&&<div className="stat-sub truncate" title={s.maxTender.name}>{s.maxTender.name.slice(0,25)}</div>}
          </div>
          <div className="stat-card cursor-pointer hover:border-amber-300 transition-colors" style={{borderColor:'var(--warn)',borderWidth:'1px'}} onClick={()=>s.minTender&&onTenderClick(s.minTender.id)}>
            <div className="stat-label">أقل ترسية</div><div className="stat-value text-base" style={{color:'var(--warn)'}}>{fmtSarShort(s.minAwardedValue)} ر.س</div>{s.minTender&&<div className="stat-sub truncate" title={s.minTender.name}>{s.minTender.name.slice(0,25)}</div>}
          </div>
          <div className="stat-card"><div className="stat-label">القبول الفني</div><div className="stat-value">{s.technicalPassRate.toFixed(0)}%</div><div className="stat-sub">{s.totalTechnicalPass} من {s.totalBidders}</div></div>
          <div className="stat-card"><div className="stat-label">متوسط المتنافسين</div><div className="stat-value">{s.avgBiddersPerTender.toFixed(1)}</div><div className="stat-sub">مقدم لكل منافسة</div></div>
          <div className="stat-card"><div className="stat-label">متوسط الخصم</div><div className="stat-value" style={{color:s.priceAnalysis.avgDiscount>0?'var(--success)':'var(--text)'}}>{s.priceAnalysis.avgDiscount.toFixed(1)}%</div><div className="stat-sub">من {s.priceAnalysis.tenderCount} ترسية</div></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {s.supplierTop.length>0&&<div className="card p-5"><h3 className="text-sm font-semibold mb-1" style={{color:'var(--text)'}}>أكثر الموردين فوزاً بالترسيات</h3><p className="text-[11px] mb-4" style={{color:'var(--text-3)'}}>اضغط على المورد لعرض ترسياته</p><BarChart items={s.supplierTop} valueKey="totalValue" subLabel="ترسية" onItemClick={item=>{const d=s.supplierTop.find(x=>x.name===item.name);if(d)onDrillDown(`ترسيات: ${item.name}`,d.tenders);}}/></div>}
          {s.agencyTop.length>0&&<div className="card p-5"><h3 className="text-sm font-semibold mb-1" style={{color:'var(--text)'}}><span className="flex items-center gap-2"><BuildingIcon c="w-4 h-4"/> الجهات الأكثر إنفاقاً</span></h3><p className="text-[11px] mb-4" style={{color:'var(--text-3)'}}>اضغط على الجهة لعرض ترسياتها</p>
            <BarChart items={s.agencyTop} valueKey="totalValue" subLabel="ترسية" onItemClick={item=>{const d=s.agencyTop.find(x=>x.name===item.name);if(d)onDrillDown(`ترسيات: ${item.name}`,d.tenders);}}/>
            <div className="mt-4 pt-3" style={{borderTop:'1px solid var(--border)'}}><h4 className="text-xs font-semibold mb-3" style={{color:'var(--text-3)'}}>متوسط قيمة الترسية لكل جهة</h4><div className="space-y-2">{s.agencyTop.slice(0,5).map(a=><div key={a.name} className="flex items-center justify-between text-xs"><span className="truncate flex-1" style={{color:'var(--text-2)'}} title={a.name}>{a.name}</span><span className="font-mono font-medium mr-3" style={{color:'var(--brand)',direction:'ltr'}}>{fmtSarShort(a.avgValue)} ر.س</span></div>)}</div></div>
          </div>}
        </div>
      </>)}

      {/* Suppliers Tab */}
      {activeTab==='suppliers'&&(<>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm" style={{color:'var(--text-2)'}}>{s.supplierProfiles.length} مورد فائز بترسيات</p>
          {s.supplierProfiles.length>0&&<button onClick={()=>setShowSupplierModal(true)} className="btn-primary btn-sm">📊 عرض المقارنة الكاملة</button>}
        </div>
        {/* Quick top-10 supplier comparison table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr style={{background:'var(--surface-dim)'}}>
                <th className="text-right px-4 py-3 font-semibold text-xs" style={{color:'var(--text-3)'}}>#</th>
                <th className="text-right px-4 py-3 font-semibold text-xs" style={{color:'var(--text-3)'}}>المورد</th>
                <th className="text-right px-4 py-3 font-semibold text-xs" style={{color:'var(--text-3)'}}>ترسيات</th>
                <th className="text-right px-4 py-3 font-semibold text-xs" style={{color:'var(--text-3)'}}>تقديم</th>
                <th className="text-right px-4 py-3 font-semibold text-xs" style={{color:'var(--text-3)'}}>نسبة الفوز</th>
                <th className="text-right px-4 py-3 font-semibold text-xs" style={{color:'var(--text-3)'}}>الإجمالي</th>
                <th className="text-right px-4 py-3 font-semibold text-xs" style={{color:'var(--text-3)'}}>المتوسط</th>
                <th className="text-right px-4 py-3 font-semibold text-xs" style={{color:'var(--text-3)'}}>الجهات</th>
              </tr></thead>
              <tbody>{s.supplierProfiles.slice(0,10).map((sp,i)=>(
                <tr key={sp.name} className="table-row-hover cursor-pointer" style={{borderTop:'1px solid var(--border)'}} onClick={()=>onDrillDown(`ترسيات: ${sp.name}`,sp.tenders)}>
                  <td className="px-4 py-2.5 font-mono text-xs" style={{color:'var(--text-3)'}}>{i+1}</td>
                  <td className="px-4 py-2.5 font-medium" style={{color:'var(--text)'}}><span className="line-clamp-1" title={sp.name}>{sp.name}</span></td>
                  <td className="px-4 py-2.5 font-bold" style={{color:'var(--brand)'}}>{sp.awardCount}</td>
                  <td className="px-4 py-2.5" style={{color:'var(--text-2)'}}>{sp.bidCount||'—'}</td>
                  <td className="px-4 py-2.5"><span className="badge text-[11px]" style={{background:sp.winRate>=50?'var(--success-bg)':'var(--warn-bg)',color:sp.winRate>=50?'var(--success)':'var(--warn)'}}>{sp.winRate>0?sp.winRate.toFixed(0)+'%':'—'}</span></td>
                  <td className="px-4 py-2.5 font-mono text-xs font-bold" style={{color:'var(--brand)',direction:'ltr',textAlign:'right'}}>{fmtSarShort(sp.totalAwarded)}</td>
                  <td className="px-4 py-2.5 font-mono text-xs" style={{color:'var(--text-2)',direction:'ltr',textAlign:'right'}}>{fmtSarShort(sp.avgAwarded)}</td>
                  <td className="px-4 py-2.5 text-xs" style={{color:'var(--text-2)'}}>{sp.agencies.length}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          {s.supplierProfiles.length>10&&<div className="px-4 py-3 text-center" style={{borderTop:'1px solid var(--border)',background:'var(--surface-dim)'}}><button onClick={()=>setShowSupplierModal(true)} className="text-sm font-medium" style={{color:'var(--accent)'}}>عرض الكل ({s.supplierProfiles.length} مورد) ←</button></div>}
        </div>
      </>)}

      {/* Activities Tab */}
      {activeTab==='activities'&&(<>
        {s.activityBreakdown.length>0?(<>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="stat-card"><div className="stat-label">عدد الأنشطة</div><div className="stat-value">{s.activityBreakdown.length}</div></div>
            <div className="stat-card"><div className="stat-label">أعلى نشاط (قيمة)</div><div className="stat-value text-base">{fmtSarShort(s.activityBreakdown[0]?.totalValue||0)} ر.س</div><div className="stat-sub truncate">{s.activityBreakdown[0]?.name}</div></div>
            <div className="stat-card"><div className="stat-label">أعلى نشاط (عدد)</div><div className="stat-value text-base">{Math.max(...s.activityBreakdown.map(a=>a.count))}</div><div className="stat-sub truncate">{[...s.activityBreakdown].sort((a,b)=>b.count-a.count)[0]?.name}</div></div>
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-1" style={{color:'var(--text)'}}>توزيع الترسيات حسب النشاط</h3>
            <p className="text-[11px] mb-4" style={{color:'var(--text-3)'}}>اضغط على النشاط لعرض ترسياته</p>
            <ActivityChart activities={s.activityBreakdown} onDrillDown={onDrillDown}/>
          </div>
        </>):(<div className="card p-10 text-center"><p className="text-sm" style={{color:'var(--text-3)'}}>لا توجد بيانات أنشطة في المنافسات المحملة</p></div>)}
      </>)}

      {showSupplierModal&&<SupplierComparisonModal profiles={s.supplierProfiles} onClose={()=>setShowSupplierModal(false)} onTenderClick={onTenderClick}/>}
    </div>
  );
}

// FilterPanel
type FilterState = Record<string,string|boolean|undefined>;

function FilterPanel({filters,onChange,onClear,agencies,regions,activities}:{filters:FilterState;onChange:(f:FilterState)=>void;onClear:()=>void;agencies:string[];regions:string[];activities:string[];}) {
  const [showDates,setShowDates]=useState(false);
  const activeCount=Object.values(filters).filter(v=>v!==undefined&&v!=='').length;
  return (<div className="animate-fadeIn">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <SearchableDropdown label="الجهة الطالبة" icon={<BuildingIcon c="w-3.5 h-3.5"/>} value={(filters.agency_search as string)||''} onChange={v=>onChange({...filters,agency_search:v||undefined})} options={agencies} placeholder="ابحث باسم الجهة..."/>
      <SearchableDropdown label="منطقة التنفيذ" icon={<MapIcon c="w-3.5 h-3.5"/>} value={(filters.region_search as string)||''} onChange={v=>onChange({...filters,region_search:v||undefined})} options={regions} placeholder="ابحث بالمنطقة..."/>
      <SearchableDropdown label="النشاط / التصنيف" icon={<span className="text-xs">🏗️</span>} value={(filters.activity_search as string)||''} onChange={v=>onChange({...filters,activity_search:v||undefined})} options={activities} placeholder="IT، إنشاءات، صيانة..."/>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <div><label className="label">حالة المنافسة</label><select value={(filters.competition_status as string)||''} onChange={e=>onChange({...filters,competition_status:e.target.value||undefined})} className="input"><option value="">جميع الحالات</option>{STATUS_GROUPS.map(g=><optgroup key={g.label} label={g.label}>{g.statuses.map(s=><option key={s} value={s}>{s}</option>)}</optgroup>)}</select></div>
      <div><label className="label">نشر الترسية</label><select value={filters.awarding_published===undefined?'':String(filters.awarding_published)} onChange={e=>{const v=e.target.value;onChange({...filters,awarding_published:v===''?undefined:v==='true'});}} className="input"><option value="">الكل</option><option value="true">نعم</option><option value="false">لا</option></select></div>
    </div>
    <div className="mt-3">
      <button type="button" onClick={()=>setShowDates(!showDates)} className="btn-ghost btn-sm text-xs"><CalendarIcon/> فلاتر التواريخ <ChevronIcon c="w-3 h-3" dir={showDates?'up':'down'}/></button>
      {showDates&&(<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 animate-fadeIn">
        {DATE_FILTERS.map(df=>(<div key={df.key}><label className="label text-xs">{df.label}</label><div className="flex gap-2">
          <input type="date" value={df.isDatetime?((filters[df.fromKey] as string)||'').split('T')[0]:((filters[df.fromKey] as string)||'')} onChange={e=>onChange({...filters,[df.fromKey]:e.target.value?(df.isDatetime?e.target.value+'T00:00:00Z':e.target.value):undefined})} className="input flex-1"/>
          <input type="date" value={df.isDatetime?((filters[df.toKey] as string)||'').split('T')[0]:((filters[df.toKey] as string)||'')} onChange={e=>onChange({...filters,[df.toKey]:e.target.value?(df.isDatetime?e.target.value+'T23:59:59Z':e.target.value):undefined})} className="input flex-1"/>
        </div></div>))}
      </div>)}
    </div>
    {activeCount>0&&<div className="mt-3"><button type="button" onClick={onClear} className="btn-ghost btn-sm" style={{color:'var(--danger)'}}><XIcon c="w-3.5 h-3.5"/> مسح الفلاتر ({activeCount})</button></div>}
  </div>);
}

// Pagination
function Pagination({page,totalPages,total,limit,onPageChange}:{page:number;totalPages:number;total:number;limit:number;onPageChange:(p:number)=>void}) {
  const s=(page-1)*limit+1,e=Math.min(page*limit,total);
  const pages=useMemo(()=>{const p:(number|'e')[]=[];if(totalPages<=7){for(let i=1;i<=totalPages;i++)p.push(i);}else{p.push(1);if(page>3)p.push('e');for(let i=Math.max(2,page-1);i<=Math.min(totalPages-1,page+1);i++)p.push(i);if(page<totalPages-2)p.push('e');p.push(totalPages);}return p;},[page,totalPages]);
  return (<div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4">
    <p className="text-sm" style={{color:'var(--text-3)'}}><span className="font-medium" style={{color:'var(--text-2)'}}>{s}–{e}</span> من <span className="font-medium" style={{color:'var(--text-2)'}}>{total.toLocaleString('en-US')}</span></p>
    <div className="flex items-center gap-1">
      <button onClick={()=>onPageChange(page-1)} disabled={page===1} className="btn-secondary btn-sm disabled:opacity-40"><ChevronIcon c="w-4 h-4" dir="right"/></button>
      <div className="hidden sm:flex items-center gap-0.5">{pages.map((p,i)=>p==='e'?<span key={`e${i}`} className="px-2 text-sm" style={{color:'var(--text-3)'}}>…</span>:<button key={p} onClick={()=>onPageChange(p)} className="min-w-[2rem] h-8 text-sm font-medium rounded-md" style={{background:p===page?'var(--brand)':'transparent',color:p===page?'#fff':'var(--text-2)'}}>{p}</button>)}</div>
      <span className="sm:hidden text-sm px-3" style={{color:'var(--text-2)'}}>{page} / {totalPages}</span>
      <button onClick={()=>onPageChange(page+1)} disabled={page>=totalPages} className="btn-secondary btn-sm disabled:opacity-40"><ChevronIcon c="w-4 h-4" dir="left"/></button>
    </div>
  </div>);
}
// URL Serialization
function allStateFromUrl(sp:URLSearchParams) {
  const filters:FilterState={};
  FILTER_KEYS.forEach(k=>{const v=sp.get(k);if(v!==null&&v!==''){if(k==='awarding_published')filters[k]=v==='true';else filters[k]=v;}});
  CUSTOM_FILTER_KEYS.forEach(k=>{const v=sp.get(k);if(v!==null&&v!=='')filters[k]=v;});
  return {search:sp.get('search')||'',searchMode:(sp.get('search_mode') as TenderSearchMode)||'tokens',page:parseInt(sp.get('page')||'1',10),filters,showFilters:Object.keys(filters).length>0};
}
function buildUrlFromState(search:string,searchMode:TenderSearchMode,page:number,filters:FilterState):string {
  const p=new URLSearchParams();
  if(search) p.set('search',search); if(searchMode!=='tokens') p.set('search_mode',searchMode); if(page>1) p.set('page',String(page));
  [...FILTER_KEYS,...CUSTOM_FILTER_KEYS].forEach(k=>{const v=filters[k];if(v!==undefined&&v!=='') p.set(k,String(v));});
  const qs=p.toString(); return qs?`/tenders?${qs}`:'/tenders';
}
function buildApiParams(search:string,searchMode:TenderSearchMode,page:number,filters:FilterState):TenderListParams {
  const params:Record<string,unknown>={search_mode:searchMode,page,limit:20};
  const parts:string[]=[]; if(search) parts.push(search); if(filters.agency_search) parts.push(filters.agency_search as string); if(filters.region_search) parts.push(filters.region_search as string); if(filters.activity_search) parts.push(filters.activity_search as string);
  if(parts.length>0) params.search=parts.join(' ');
  FILTER_KEYS.forEach(k=>{const v=filters[k];if(v!==undefined&&v!=='') params[k]=v;});
  return params as TenderListParams;
}

// Main
function TendersPageInner() {
  const router=useRouter(); const searchParams=useSearchParams(); const {isLoading:authLoading,isLoggedIn}=useAuth();
  const urlState=useMemo(()=>allStateFromUrl(searchParams),[searchParams]);
  const [searchInput,setSearchInput]=useState(urlState.search);
  const [searchMode,setSearchMode]=useState<TenderSearchMode>(urlState.searchMode);
  const [showFilters,setShowFilters]=useState(urlState.showFilters);
  const [filters,setFilters]=useState<FilterState>(urlState.filters);
  const [showAnalytics,setShowAnalytics]=useState(false);
  const [drillDown,setDrillDown]=useState<{title:string;tenders:{id:string;name:string;value:number}[]}|null>(null);

  const prevUrlRef=useRef(searchParams.toString());
  useEffect(()=>{
    const current=searchParams.toString();
    if(current!==prevUrlRef.current){prevUrlRef.current=current;const ns=allStateFromUrl(searchParams);setSearchInput(ns.search);setSearchMode(ns.searchMode);setFilters(ns.filters);if(Object.keys(ns.filters).length>0) setShowFilters(true);}
  },[searchParams]);

  const queryParams=useMemo(()=>buildApiParams(urlState.search,urlState.searchMode,urlState.page,urlState.filters),[urlState]);
  const [analyticsStats,setAnalyticsStats]=useState<AnalyticsData|null>(null);
  const [analyticsLoading,setAnalyticsLoading]=useState(false);
  const [analyticsProgress,setAnalyticsProgress]=useState({phase:'',current:0,total:0});
  const analyticsAbortRef=useRef(false);
  const [analyticsQueryKey,setAnalyticsQueryKey]=useState('');
  const [knownAgencies,setKnownAgencies]=useState<string[]>([]);
  const [knownRegions,setKnownRegions]=useState<string[]>(SAUDI_REGIONS);
  const [knownActivities,setKnownActivities]=useState<string[]>(COMMON_ACTIVITIES);
  const [awardCache,setAwardCache]=useState<Record<string,{supplier:string;value:string}|null>>({});

  const {data,isLoading,error,refetch}=useQuery({queryKey:['tenders',queryParams],queryFn:()=>getTenders(queryParams),enabled:isLoggedIn});

  useEffect(()=>{
    if(data?.items){const agencies=data.items.map(t=>t.agency_name).filter((a):a is string=>!!a);setKnownAgencies(prev=>Array.from(new Set([...prev,...agencies])).sort());}
  },[data]);

  // Lazy-load award info for tenders with published awarding
  useEffect(()=>{
    if(!data?.items) return;
    const toFetch=data.items.filter(t=>t.awarding_published&&awardCache[t.id]===undefined);
    if(toFetch.length===0) return;
    // Mark as loading
    const loading:Record<string,null>={};
    toFetch.forEach(t=>{loading[t.id]=null;});
    setAwardCache(prev=>({...prev,...loading}));
    // Fetch in background
    (async()=>{
      const results=await getTenderDetailsBatch(toFetch.map(t=>t.id),5);
      const updates:Record<string,{supplier:string;value:string}|null>={};
      for(const r of results){
        if(r.awarded&&r.awarded.length>0){
          const a=r.awarded[0];
          updates[r.id]={supplier:a.supplier_name,value:a.awarded_value||'0'};
        } else { updates[r.id]=null; }
      }
      setAwardCache(prev=>({...prev,...updates}));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[data]);

  const navigateWithParams=useCallback((search:string,mode:TenderSearchMode,page:number,f:FilterState)=>{router.push(buildUrlFromState(search,mode,page,f));},[router]);
  const handleSearch=useCallback((e?:React.FormEvent)=>{e?.preventDefault();setAnalyticsStats(null);setAnalyticsQueryKey('');navigateWithParams(searchInput,searchMode,1,filters);},[searchInput,searchMode,filters,navigateWithParams]);
  const handlePageChange=useCallback((p:number)=>{navigateWithParams(urlState.search,urlState.searchMode,p,urlState.filters);window.scrollTo({top:0,behavior:'smooth'});},[urlState,navigateWithParams]);
  const handleClearFilters=useCallback(()=>{setFilters({});setAnalyticsStats(null);setAnalyticsQueryKey('');navigateWithParams(urlState.search,urlState.searchMode,1,{});},[urlState,navigateWithParams]);
  const handleTenderClick=useCallback((id:string)=>{setDrillDown(null);router.push(`/tenders/${id}`);},[router]);

  useEffect(()=>{
    if(!showAnalytics||!data||data.meta.total===0) return;
    const key=JSON.stringify(queryParams); if(key===analyticsQueryKey&&analyticsStats) return;
    analyticsAbortRef.current=false; setAnalyticsLoading(true); setAnalyticsProgress({phase:'جاري جمع المنافسات...',current:0,total:data.meta.total});
    const baseParams={...queryParams}; delete baseParams.page; delete baseParams.limit;
    (async()=>{
      try{
        const {ids,total}=await getAllTenderIds(baseParams,MAX_ANALYTICS_TENDERS,(f,t)=>{if(!analyticsAbortRef.current) setAnalyticsProgress({phase:'جاري جمع المنافسات...',current:f,total:t});});
        if(analyticsAbortRef.current) return;
        setAnalyticsProgress({phase:'جاري تحميل التفاصيل...',current:0,total:ids.length});
        const details=await getTenderDetailsBatch(ids,15,(f,t)=>{if(!analyticsAbortRef.current) setAnalyticsProgress({phase:'جاري تحميل التفاصيل...',current:f,total:t});});
        if(!analyticsAbortRef.current){
          const regionSet=new Set(knownRegions); const agSet=new Set(knownAgencies);
          for(const d of details){if(d.classification?.execution_place?.regions) for(const r of d.classification.execution_place.regions) regionSet.add(r.name);if(d.agency_name) agSet.add(d.agency_name);}
          setKnownRegions(Array.from(regionSet).sort()); setKnownAgencies(Array.from(agSet).sort());
          const analytics=computeAnalytics(details,total);
          setAnalyticsStats(analytics); setAnalyticsQueryKey(key);
          if(analytics.knownActivities.length>0) setKnownActivities(prev=>Array.from(new Set([...prev,...analytics.knownActivities])).sort());
        }
      }catch(e){console.error('Analytics error:',e);}
      finally{if(!analyticsAbortRef.current)setAnalyticsLoading(false);}
    })();
    return()=>{analyticsAbortRef.current=true;};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[showAnalytics,data,queryParams]);

  const activeFilterCount=Object.values(filters).filter(v=>v!==undefined&&v!=='').length;
  const searchQuery=urlState.search||'';

  if(authLoading) return <div className="min-h-screen flex items-center justify-center" style={{background:'var(--surface-dim)'}}><div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin" style={{borderTopColor:'var(--accent)',borderLeftColor:'var(--accent)'}}/></div>;
  if(!isLoggedIn) return null;

  return (
    <div className="min-h-screen" style={{background:'var(--surface-dim)'}}>
      <Header/>
      <main className="page-container">
        <div className="card p-5 mb-5">
          <form onSubmit={handleSearch}>
            <div className="flex gap-3">
              <div className="flex-1 relative"><SearchIcon c="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/><input type="text" value={searchInput} onChange={e=>setSearchInput(e.target.value)} placeholder="البحث بالاسم، الجهة، الرقم المرجعي…" className="input input-lg pr-10"/></div>
              <select value={searchMode} onChange={e=>setSearchMode(e.target.value as TenderSearchMode)} className="input w-24 sm:w-32">{Object.entries(SEARCH_MODE_INFO).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select>
              <button type="submit" className="btn-primary"><SearchIcon/><span className="hidden sm:inline">بحث</span></button>
            </div>
            <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs" style={{color:'var(--text-3)'}}>{SEARCH_MODE_INFO[searchMode].help}</p>
              <div className="flex gap-2">
                <button type="button" onClick={()=>{setShowAnalytics(!showAnalytics);if(showAnalytics){analyticsAbortRef.current=true;setAnalyticsLoading(false);}}} className="btn-ghost btn-sm" style={{color:showAnalytics?'var(--accent)':undefined}}><ChartIcon c="w-3.5 h-3.5"/> تحليلات{showAnalytics&&analyticsStats&&<span className="badge badge-green mr-1">✓</span>}</button>
                <button type="button" onClick={()=>setShowFilters(!showFilters)} className="btn-ghost btn-sm" style={{color:activeFilterCount>0?'var(--accent)':undefined}}><FilterIcon c="w-3.5 h-3.5"/> فلاتر{activeFilterCount>0&&<span className="badge badge-blue mr-1">{activeFilterCount}</span>}<ChevronIcon c="w-3 h-3" dir={showFilters?'up':'down'}/></button>
              </div>
            </div>
            {showFilters&&(<div className="mt-4 pt-4" style={{borderTop:'1px solid var(--border)'}}><FilterPanel filters={filters} onChange={setFilters} onClear={handleClearFilters} agencies={knownAgencies} regions={knownRegions} activities={knownActivities}/><div className="mt-4 flex justify-start"><button type="button" onClick={handleSearch} className="btn-primary btn-sm">تطبيق الفلاتر</button></div></div>)}
          </form>
        </div>

        {/* Quick Filter Chips */}
        {(()=>{
          const cs=urlState.filters.competition_status as string|undefined;
          const chips:[string,string,string][]=[
            ['قبول العروض','متاحة للتقديم',STATUS_STYLES.active.dot],
            ['تقييم العروض','تحت التقييم',STATUS_STYLES.evaluation.dot],
            ['في انتظار الترسية','بانتظار الترسية',STATUS_STYLES.pending.dot],
            ['تم اعتماد الترسية','ترسيات معتمدة',STATUS_STYLES.awarded.dot],
            ['تم إلغاء المنافسة','ملغاة',STATUS_STYLES.cancelled.dot],
          ];
          return (<div className="flex flex-wrap gap-2 mb-4">
            <button onClick={()=>{setFilters({});setSearchInput('');navigateWithParams('','tokens',1,{});}}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{background:activeFilterCount===0?'var(--brand)':'var(--surface)',color:activeFilterCount===0?'#fff':'var(--text-2)',border:'1px solid '+(activeFilterCount===0?'var(--brand)':'var(--border)'),boxShadow:'var(--shadow-sm)'}}>
              الكل
            </button>
            {chips.map(([status,label,dot])=>{
              const isActive=cs===status;
              return (
                <button key={status} onClick={()=>{setFilters({competition_status:status});setSearchInput('');navigateWithParams('','tokens',1,{competition_status:status});}}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{background:isActive?'var(--brand)':'var(--surface)',color:isActive?'#fff':'var(--text-2)',border:'1px solid '+(isActive?'var(--brand)':'var(--border)'),boxShadow:'var(--shadow-sm)'}}>
                  <span style={{color:isActive?'#fff':dot,fontSize:'10px'}}>●</span> {label}
                </button>
              );
            })}
          </div>);
        })()}

        {showAnalytics&&data&&data.meta.total>0&&(<AnalyticsDashboard stats={analyticsStats} progress={analyticsProgress} isLoading={analyticsLoading} onDrillDown={(title,tenders)=>setDrillDown({title,tenders})} onTenderClick={handleTenderClick}/>)}

        {data&&!isLoading&&(<div className="mb-4"><p className="text-sm" style={{color:'var(--text-2)'}}><span className="font-semibold" style={{color:'var(--text)'}}>{fmtNum(data.meta.total)}</span> منافسة{queryParams.search&&<> لـ &quot;<span className="font-medium">{queryParams.search}</span>&quot;</>}</p></div>)}

        {isLoading&&<CardSkeleton/>}
        {error&&<div className="card p-6"><div className="p-4 rounded-lg" style={{background:'var(--danger-bg)',border:'1px solid #fecaca'}}><p className="text-sm" style={{color:'var(--danger)'}}>فشل تحميل المنافسات.</p><button onClick={()=>refetch()} className="mt-2 text-sm underline" style={{color:'var(--danger)'}}>إعادة المحاولة</button></div></div>}
        {data&&!isLoading&&(<>
          {data.items.length>0?(<div className="space-y-3">{data.items.map((t,idx)=>(<TenderCard key={t.id} t={t} searchQuery={searchQuery} onClick={()=>handleTenderClick(t.id)} index={idx} awardInfo={awardCache[t.id]}/>))}</div>):(<div className="card p-16 text-center"><SearchIcon c="w-10 h-10 mx-auto mb-3"/><p className="font-medium" style={{color:'var(--text-2)'}}>لا توجد منافسات</p>{queryParams.search&&<button onClick={()=>{setSearchInput('');setFilters({});navigateWithParams('','tokens',1,{});}} className="mt-3 btn-ghost btn-sm" style={{color:'var(--accent)'}}>مسح البحث والفلاتر</button>}</div>)}
          {data.items.length>0&&data.meta.pages>1&&<Pagination page={data.meta.page} totalPages={data.meta.pages} total={data.meta.total} limit={data.meta.limit} onPageChange={handlePageChange}/>}
        </>)}
      </main>
      <ScrollToTop/>
      {drillDown&&<DrillDownModal title={drillDown.title} tenders={drillDown.tenders} onClose={()=>setDrillDown(null)} onTenderClick={handleTenderClick}/>}
    </div>
  );
}

export default function TendersPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{background:'var(--surface-dim)'}}><div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin" style={{borderTopColor:'var(--accent)',borderLeftColor:'var(--accent)'}}/></div>}><TendersPageInner/></Suspense>;
}
