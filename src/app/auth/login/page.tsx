'use client';
import LoginCard from '@/components/auth/login/login-card';
import React, { useState, useEffect } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className='bg-primary w-full h-full flex flex-col'>
      <LoginCard/>
    </div>
  )


  // useEffect(() => { setError(''); }, [username, password]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault(); setError(''); setIsSubmitting(true);
  //   try { await login(username, password); }
  //   catch (err) { setError(err instanceof ApiException ? err.message : 'حدث خطأ غير متوقع'); }
  //   finally { setIsSubmitting(false); }
  // };

  // if (authLoading || isLoggedIn) return (
  //   <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: 'var(--surface-dim)' }}>
  //     <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: 'var(--accent)', borderLeftColor: 'var(--accent)' }} />
  //     {isLoggedIn && <p className="text-sm" style={{ color: 'var(--text-2)' }}>جارٍ التحويل...</p>}
  //   </div>
  // );

  // return (
  //   <AuthProvider>
  //   <div className="min-h-screen flex" style={{ background: 'var(--surface-dim)' }}>
  //     {/* Left branding panel */}
  //     <div className="hidden lg:flex lg:w-[45%] flex-col justify-center items-center p-12 relative overflow-hidden"
  //       style={{ background: 'linear-gradient(135deg, var(--brand-dark) 0%, var(--brand) 50%, var(--accent) 100%)' }}>
  //       <div className="absolute inset-0 opacity-10">
  //         <svg className="w-full h-full" viewBox="0 0 400 400"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs><rect width="400" height="400" fill="url(#grid)" /></svg>
  //       </div>
  //       <div className="relative z-10 text-center animate-fadeIn">
  //         <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-white font-bold text-3xl mb-6"
  //           style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>م</div>
  //         <h1 className="text-3xl font-bold text-white mb-3">بوابة المنافسات</h1>
  //         <p className="text-base text-cyan-200 max-w-xs mx-auto leading-relaxed">منصة البحث والتحليل للمنافسات والمشتريات الحكومية في المملكة العربية السعودية</p>
  //         <div className="mt-10 flex gap-8 justify-center">
  //           <div className="text-center"><div className="text-2xl font-bold text-white">+440K</div><div className="text-xs text-cyan-300">منافسة مرصودة</div></div>
  //           <div className="text-center"><div className="text-2xl font-bold text-white">+1.8M</div><div className="text-xs text-cyan-300">عرض مقدم</div></div>
  //           <div className="text-center"><div className="text-2xl font-bold text-white">+2600</div><div className="text-xs text-cyan-300">جهة حكومية</div></div>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Right login form */}
  //     <div className="flex-1 flex items-center justify-center px-6 py-12">
  //       <div className="w-full max-w-sm animate-fadeInUp">
  //         <div className="lg:hidden text-center mb-8">
  //           <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4"
  //             style={{ background: 'linear-gradient(135deg, var(--brand), var(--accent))', boxShadow: '0 4px 16px rgba(8,145,178,0.3)' }}>م</div>
  //           <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>بوابة المنافسات</h1>
  //         </div>
  //         <div className="mb-6">
  //           <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>تسجيل الدخول</h2>
  //           <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>أدخل بياناتك للوصول إلى المنصة</p>
  //         </div>
  //         <div className="card p-7" style={{ boxShadow: 'var(--shadow-lg)' }}>
  //           <form onSubmit={handleSubmit} className="space-y-5">
  //             {error && (
  //               <div className="flex items-center gap-2 p-3 text-sm rounded-lg animate-fadeIn" style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid #fecaca' }}>
  //                 <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
  //                 {error}
  //               </div>
  //             )}
  //             <div>
  //               <label htmlFor="username" className="label">اسم المستخدم</label>
  //               <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} className="input" placeholder="أدخل اسم المستخدم" required autoComplete="username" autoFocus />
  //             </div>
  //             <div>
  //               <label htmlFor="password" className="label">كلمة المرور</label>
  //               <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="أدخل كلمة المرور" required autoComplete="current-password" />
  //             </div>
  //             <button type="submit" disabled={isSubmitting || !username || !password} className="btn-primary w-full" style={{ padding: '0.625rem 1rem' }}>
  //               {isSubmitting ? (
  //                 <span className="flex items-center justify-center gap-2">
  //                   <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
  //                   جارٍ تسجيل الدخول…
  //                 </span>
  //               ) : 'تسجيل الدخول'}
  //             </button>
  //           </form>
  //         </div>
  //         <p className="text-center text-xs mt-6" style={{ color: 'var(--text-3)' }}>بوابة المنافسات — تحليل المنافسات الحكومية</p>
  //       </div>
  //     </div>
  //   </div>
  //   </AuthProvider>
  //);
}
