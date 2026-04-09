'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getTenders } from '@/lib/api';
import type { TenderMin, TenderListResponse } from '@/types';
import { format, parseISO, differenceInDays, differenceInHours } from 'date-fns';
import { ar } from 'date-fns/locale';

function fmtDate(d:string|undefined|null){if(!d) return '—';try{return format(parseISO(d),'d MMM yyyy',{locale:ar});}catch{return d;}}
function fmtNum(n:number){return n.toLocaleString('en-US');}
function fmtSar(a:string|undefined|null){if(!a) return '—';const n=parseFloat(a);if(isNaN(n)) return a;return n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' ر.س';}

// Icons
const SearchIcon=()=><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>;
const ChartIcon=()=><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>;
const ClockIcon=()=><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const ArrowIcon=()=><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>;
const BuildingIcon=()=><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>;

function statusColor(s:string|undefined):{bg:string;text:string;dot:string}{
  if(!s) return {bg:'#f1f5f9',text:'var(--text-3)',dot:'#94a3b8'};
  if(s==='قبول العروض'||s==='مرحلة المزايدة المباشرة') return {bg:'var(--brand-lighter)',text:'var(--brand)',dot:'#3b82f6'};
  if(s==='تقييم العروض'||s.includes('إعتماد تقرير')||s.includes('اعتماد تقييم')) return {bg:'var(--warn-bg)',text:'var(--warn)',dot:'#f59e0b'};
  if(s.includes('انتظار')||s.includes('معادة')||s.includes('استثناء')) return {bg:'#fef3c7',text:'#92400e',dot:'#d97706'};
  if(s==='تمت الترسية'||s==='تم اعتماد الترسية') return {bg:'var(--success-bg)',text:'var(--success)',dot:'#22c55e'};
  if(s.includes('إلغاء')||s.includes('رفض')) return {bg:'var(--danger-bg)',text:'var(--danger)',dot:'#ef4444'};
  return {bg:'#f1f5f9',text:'var(--text-3)',dot:'#94a3b8'};
}

function parseRemainingTime(text:string|undefined):{days:number;hours:number;urgent:boolean}|null {
  if(!text) return null;
  const dM=text.match(/(\d+)\s*يوم/); const hM=text.match(/(\d+)\s*ساع/);
  const days=dM?parseInt(dM[1]):0; const hours=hM?parseInt(hM[1]):0;
  return {days,hours,urgent:days<3};
}

// Header
function Header() {
  const {user,logout}=useAuth();
  const router=useRouter();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b" style={{borderColor:'var(--border)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex justify-between items-center h-14">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{background:'linear-gradient(135deg, var(--brand), var(--accent))'}}>م</div>
          <h1 className="text-lg font-semibold" style={{color:'var(--text)'}}>بوابة المنافسات</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={()=>router.push('/tenders')} className="btn-ghost btn-sm"><SearchIcon/><span className="hidden sm:inline">البحث</span></button>
          {user&&(<div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:'var(--accent)'}}>{(user.username||'U')[0].toUpperCase()}</div><span className="text-sm hidden sm:inline" style={{color:'var(--text-2)'}}>{user.username}</span></div>)}
          <button onClick={logout} className="btn-ghost btn-sm" style={{color:'var(--danger)'}}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </div></div>
    </header>
  );
}

// Mini tender card for dashboard lists
function MiniCard({t,onClick}:{t:TenderMin;onClick:()=>void}) {
  const sc=statusColor(t.competition_status);
  const remaining=parseRemainingTime(t.remaining_time_text);
  return (
    <div onClick={onClick} className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all hover:shadow-md" style={{background:'var(--surface)',border:'1px solid var(--border)'}}>
      <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{background:sc.dot}}/>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold leading-snug line-clamp-2" style={{color:'var(--text)'}}>{t.name}</h4>
        {t.agency_name&&<p className="text-xs mt-1 flex items-center gap-1" style={{color:'var(--text-2)'}}><BuildingIcon/>{t.agency_name}</p>}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {t.competition_status&&<span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{background:sc.bg,color:sc.text}}>{t.competition_status}</span>}
          {remaining&&<span className="text-[11px] font-medium" style={{color:remaining.urgent?'var(--danger)':'var(--text-3)'}}>{remaining.urgent?'⚡':''} {t.remaining_time_text}</span>}
          {t.publish_date&&<span className="text-[11px]" style={{color:'var(--text-3)'}}>{fmtDate(t.publish_date)}</span>}
        </div>
      </div>
    </div>
  );
}

// Stat card
function StatCard({label,value,sub,icon,color,onClick}:{label:string;value:string|number;sub?:string;icon:string;color:string;onClick?:()=>void}) {
  return (
    <div onClick={onClick} className={`card p-4 flex items-start gap-3 ${onClick?'cursor-pointer hover:shadow-md':''} transition-all`}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{background:color+'15',color}}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium" style={{color:'var(--text-3)'}}>{label}</p>
        <p className="text-xl font-bold mt-0.5" style={{color:'var(--text)',fontFamily:"'IBM Plex Mono',monospace"}}>{typeof value==='number'?fmtNum(value):value}</p>
        {sub&&<p className="text-[11px] mt-0.5" style={{color:'var(--text-3)'}}>{sub}</p>}
      </div>
    </div>
  );
}

// Section
function Section({title,icon,action,children}:{title:string;icon:string;action?:React.ReactNode;children:React.ReactNode}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold flex items-center gap-2" style={{color:'var(--text)'}}><span>{icon}</span>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

// Skeleton
function DashSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({length:4}).map((_,i)=><div key={i} className="card p-4 h-20"><div className="skeleton h-4 w-20 mb-2"/><div className="skeleton h-8 w-16"/></div>)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{Array.from({length:2}).map((_,i)=><div key={i} className="space-y-3">{Array.from({length:4}).map((_,j)=><div key={j} className="card p-4 h-24"><div className="skeleton h-4 w-3/4 mb-2"/><div className="skeleton h-3 w-1/2"/></div>)}</div>)}</div>
    </div>
  );
}

export default function DashboardPage() {
  const router=useRouter();
  const {isLoading:authLoading,isLoggedIn}=useAuth();

  const [accepting,setAccepting]=useState<TenderListResponse|null>(null);
  const [evaluating,setEvaluating]=useState<TenderListResponse|null>(null);
  const [awarded,setAwarded]=useState<TenderListResponse|null>(null);
  const [recent,setRecent]=useState<TenderListResponse|null>(null);
  const [loading,setLoading]=useState(true);
  const [searchInput,setSearchInput]=useState('');

  useEffect(()=>{
    if(!isLoggedIn) return;
    setLoading(true);
    Promise.allSettled([
      getTenders({competition_status:'قبول العروض',limit:6,page:1}),
      getTenders({competition_status:'تقييم العروض',limit:6,page:1}),
      getTenders({competition_status:'تم اعتماد الترسية',limit:6,page:1}),
      getTenders({limit:8,page:1}),
    ]).then(([a,e,aw,r])=>{
      if(a.status==='fulfilled') setAccepting(a.value);
      if(e.status==='fulfilled') setEvaluating(e.value);
      if(aw.status==='fulfilled') setAwarded(aw.value);
      if(r.status==='fulfilled') setRecent(r.value);
    }).finally(()=>setLoading(false));
  },[isLoggedIn]);

  // Sort accepting by urgency (remaining time)
  const urgentTenders=useMemo(()=>{
    if(!accepting?.items) return [];
    return [...accepting.items].sort((a,b)=>{
      const ra=parseRemainingTime(a.remaining_time_text);
      const rb=parseRemainingTime(b.remaining_time_text);
      if(!ra&&!rb) return 0; if(!ra) return 1; if(!rb) return -1;
      return (ra.days*24+ra.hours)-(rb.days*24+rb.hours);
    });
  },[accepting]);

  const handleSearch=(e:React.FormEvent)=>{e.preventDefault();if(searchInput.trim()) router.push(`/tenders?search=${encodeURIComponent(searchInput.trim())}`);else router.push('/tenders');};
  const goTender=(id:string)=>router.push(`/tenders/${id}`);
  const goFiltered=(status:string)=>router.push(`/tenders?competition_status=${encodeURIComponent(status)}`);

  if(authLoading) return <div className="min-h-screen flex items-center justify-center" style={{background:'var(--surface-dim)'}}><div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin" style={{borderTopColor:'var(--accent)',borderLeftColor:'var(--accent)'}}/></div>;
  if(!isLoggedIn) { router.push('/login'); return null; }

  return (
    <div className="min-h-screen" style={{background:'var(--surface-dim)'}}>
      <Header/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Hero search */}
        <div className="card p-6 sm:p-8 mb-6" style={{background:'linear-gradient(135deg, var(--brand-dark) 0%, var(--brand) 50%, var(--accent) 100%)'}}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">بوابة المنافسات والمشتريات الحكومية</h2>
            <p className="text-sm mb-5" style={{color:'rgba(255,255,255,0.7)'}}>ابحث في أكثر من 200,000 منافسة من منصة اعتماد</p>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <input type="text" value={searchInput} onChange={e=>setSearchInput(e.target.value)} placeholder="ابحث بالاسم، الجهة، الرقم المرجعي، النشاط..." className="w-full px-4 py-3 pr-10 rounded-lg text-sm bg-white/95 border-0" style={{color:'var(--text)'}}/>
                <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{color:'var(--text-3)'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <button type="submit" className="px-5 py-3 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90" style={{background:'rgba(255,255,255,0.2)',backdropFilter:'blur(8px)'}}>بحث</button>
            </form>
          </div>
        </div>

        {loading?<DashSkeleton/>:(<div className="space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="متاحة للتقديم" value={accepting?.meta.total||0} icon="📋" color="#3b82f6" onClick={()=>goFiltered('قبول العروض')} sub="منافسة مفتوحة الآن"/>
            <StatCard label="تحت التقييم" value={evaluating?.meta.total||0} icon="⏳" color="#f59e0b" onClick={()=>goFiltered('تقييم العروض')} sub="يتم تقييم العروض"/>
            <StatCard label="ترسيات معتمدة" value={awarded?.meta.total||0} icon="🏆" color="#22c55e" onClick={()=>goFiltered('تم اعتماد الترسية')} sub="ترسية معتمدة"/>
            <StatCard label="إجمالي المنافسات" value={recent?.meta.total||0} icon="📊" color="#0891b2" onClick={()=>router.push('/tenders')} sub="في قاعدة البيانات"/>
          </div>

          {/* Quick status navigation */}
          <div className="flex flex-wrap gap-2">
            {[
              {s:'قبول العروض',label:'متاحة للتقديم',dot:'#3b82f6'},
              {s:'تقييم العروض',label:'تحت التقييم',dot:'#f59e0b'},
              {s:'في انتظار الترسية',label:'بانتظار الترسية',dot:'#d97706'},
              {s:'تم اعتماد الترسية',label:'ترسيات معتمدة',dot:'#22c55e'},
              {s:'تمت الترسية',label:'تمت الترسية',dot:'#22c55e'},
              {s:'تم إلغاء المنافسة',label:'ملغاة',dot:'#ef4444'},
            ].map(({s,label,dot})=>(
              <button key={s} onClick={()=>goFiltered(s)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:shadow-sm" style={{background:'var(--surface)',color:'var(--text-2)',border:'1px solid var(--border)'}}>
                <span style={{color:dot,fontSize:'10px'}}>●</span> {label}
              </button>
            ))}
            <button onClick={()=>router.push('/tenders')} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:shadow-sm" style={{background:'var(--brand)',color:'#fff'}}>
              عرض الكل <ArrowIcon/>
            </button>
          </div>

          {/* Main content: 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left: Open for bidding (urgent first) */}
            <Section title="متاحة للتقديم — الأقرب للإغلاق" icon="⚡"
              action={accepting&&accepting.meta.total>6&&<button onClick={()=>goFiltered('قبول العروض')} className="text-xs font-medium" style={{color:'var(--accent)'}}>عرض الكل ({fmtNum(accepting.meta.total)}) ←</button>}>
              {urgentTenders.length>0?(
                <div className="space-y-2">{urgentTenders.map(t=><MiniCard key={t.id} t={t} onClick={()=>goTender(t.id)}/>)}</div>
              ):(
                <div className="card p-8 text-center"><p className="text-sm" style={{color:'var(--text-3)'}}>لا توجد منافسات مفتوحة حالياً</p></div>
              )}
            </Section>

            {/* Right: Recently awarded */}
            <Section title="آخر الترسيات المعتمدة" icon="🏆"
              action={awarded&&awarded.meta.total>6&&<button onClick={()=>goFiltered('تم اعتماد الترسية')} className="text-xs font-medium" style={{color:'var(--accent)'}}>عرض الكل ({fmtNum(awarded.meta.total)}) ←</button>}>
              {awarded&&awarded.items.length>0?(
                <div className="space-y-2">{awarded.items.map(t=><MiniCard key={t.id} t={t} onClick={()=>goTender(t.id)}/>)}</div>
              ):(
                <div className="card p-8 text-center"><p className="text-sm" style={{color:'var(--text-3)'}}>لا توجد ترسيات</p></div>
              )}
            </Section>
          </div>

          {/* Under evaluation */}
          {evaluating&&evaluating.items.length>0&&(
            <Section title="تحت التقييم" icon="⏳"
              action={evaluating.meta.total>6&&<button onClick={()=>goFiltered('تقييم العروض')} className="text-xs font-medium" style={{color:'var(--accent)'}}>عرض الكل ({fmtNum(evaluating.meta.total)}) ←</button>}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {evaluating.items.map(t=><MiniCard key={t.id} t={t} onClick={()=>goTender(t.id)}/>)}
              </div>
            </Section>
          )}

          {/* Footer */}
          <div className="text-center py-4">
            <button onClick={()=>router.push('/tenders')} className="btn-primary px-6 py-2.5">
              <SearchIcon/> البحث المتقدم والتحليلات
            </button>
          </div>
        </div>)}
      </main>
    </div>
  );
}
