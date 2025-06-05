'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect authenticated users to their respective dashboards
      switch (user.role) {
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        case 'PHARMACIST':
          router.push('/pharmacist/dashboard');
          break;
        case 'PHARMACY_OWNER':
          router.push('/pharmacy-owner/dashboard');
          break;
        default:
          break;
      }
    }
  }, [user, isLoading, router]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-apple-blue border-t-transparent"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen overflow-hidden font-arabic bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950 dark:via-blue-900 dark:to-blue-800">
      {/* Full-Screen Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Elegant Flying Circles Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-400/20 dark:bg-blue-300/30 rounded-full blur-xl animate-float" style={{animationDelay: '0s', animationDuration: '8s'}}></div>
          <div className="absolute top-1/3 left-10 w-24 h-24 bg-blue-300/15 dark:bg-blue-200/25 rounded-full blur-lg animate-float" style={{animationDelay: '2s', animationDuration: '10s'}}></div>
          <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-blue-500/10 dark:bg-blue-400/20 rounded-full blur-2xl animate-float" style={{animationDelay: '4s', animationDuration: '12s'}}></div>
          <div className="absolute top-2/3 right-10 w-20 h-20 bg-blue-200/20 dark:bg-blue-100/30 rounded-full blur-md animate-float" style={{animationDelay: '6s', animationDuration: '9s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-blue-600/8 dark:bg-blue-500/15 rounded-full blur-xl animate-float" style={{animationDelay: '1s', animationDuration: '11s'}}></div>
        </div>

        {/* Glassmorphism Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 rounded-2xl px-6 py-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-110">
                    <span className="text-white font-bold text-xl">ف</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">فارما بريدج</span>
                </div>
                
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8 space-x-reverse">
                  <Link href="#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium hover:scale-105">
                    المميزات
                  </Link>
                  <Link href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium hover:scale-105">
                    كيف يعمل
                  </Link>
                  <Link href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium hover:scale-105">
                    الأسعار
                  </Link>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <Link href="/auth/login" className="hidden sm:block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium hover:scale-105">
                    تسجيل الدخول
                  </Link>
                  
                  {/* Mobile Menu Button */}
                  <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm transition-all duration-300 hover:bg-white/40 dark:hover:bg-gray-700/40"
                  >
                    <div className="w-6 h-6 flex flex-col justify-center items-center">
                      <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                      <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 mt-1 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                      <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 mt-1 ${mobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Mobile Menu */}
              <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="py-4 space-y-4 border-t border-white/20 dark:border-gray-700/20">
                  <Link href="#features" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium py-2">
                    المميزات
                  </Link>
                  <Link href="#how-it-works" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium py-2">
                    كيف يعمل
                  </Link>
                  <Link href="#pricing" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium py-2">
                    الأسعار
                  </Link>
                  <Link href="/auth/login" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium py-2">
                    تسجيل الدخول
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 sm:pt-32 lg:pt-40 pb-20">
          <div className="space-y-8 sm:space-y-12 animate-fade-in">
            {/* Main Heading */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight tracking-tight">
                <span className="text-gray-900 dark:text-gray-100 block mb-2 sm:mb-4 animate-slide-up">اربط</span>
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent block mb-2 sm:mb-4 animate-slide-up" style={{animationDelay: '0.2s'}}>الصيادلة</span>
                <span className="text-gray-900 dark:text-gray-100 block animate-slide-up" style={{animationDelay: '0.4s'}}>بأصحاب الصيدليات</span>
              </h1>
            </div>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium animate-slide-up" style={{animationDelay: '0.6s'}}>
              المنصة الرائدة التي تربط الصيادلة الموهوبين بأصحاب الصيدليات.
              <br className="hidden sm:block" />
              اكتشف الفرص، أدر الاشتراكات، وانمِ عملك الصيدلاني.
            </p>

            {/* Three Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center pt-8 sm:pt-12 animate-scale-in" style={{animationDelay: '0.8s'}}>
              {/* Sign Up as Pharmacist */}
              <Link 
                href="/auth/register/pharmacist" 
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 rounded-2xl sm:rounded-3xl font-bold text-lg sm:text-xl lg:text-2xl transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-400/30 hover:-translate-y-1 w-full sm:w-auto min-w-[280px] sm:min-w-[320px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center justify-center space-x-3 space-x-reverse">
                  <span>انضم كصيدلي</span>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:-translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 7l-5 5m0 0l5 5m-5-5h14" />
                  </svg>
                </span>
              </Link>

              {/* Sign Up as Pharmacy Owner */}
              <Link 
                href="/auth/register/pharmacy-owner" 
                className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 rounded-2xl sm:rounded-3xl font-bold text-lg sm:text-xl lg:text-2xl transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-blue-400/25 dark:hover:shadow-blue-300/30 hover:-translate-y-1 w-full sm:w-auto min-w-[280px] sm:min-w-[320px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center justify-center space-x-3 space-x-reverse">
                  <span>انضم كمالك صيدلية</span>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:-translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 7l-5 5m0 0l5 5m-5-5h14" />
                  </svg>
                </span>
              </Link>

              {/* Sign In */}
              <Link 
                href="/auth/login" 
                className="group relative overflow-hidden backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border-2 border-white/30 dark:border-gray-700/30 text-gray-900 dark:text-gray-100 px-8 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 rounded-2xl sm:rounded-3xl font-bold text-lg sm:text-xl lg:text-2xl transition-all duration-500 shadow-lg hover:shadow-xl hover:bg-white/30 dark:hover:bg-gray-800/30 hover:-translate-y-1 w-full sm:w-auto min-w-[280px] sm:min-w-[320px]"
              >
                <span className="relative z-10 flex items-center justify-center space-x-3 space-x-reverse">
                  <span>تسجيل الدخول</span>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:-translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Elegant Scroll Indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce" style={{animationDelay: '1.2s'}}>
          <div className="w-6 h-10 sm:w-8 sm:h-12 border-2 border-blue-400/60 dark:border-blue-300/60 rounded-full flex justify-center items-center backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 shadow-sm">
            <div className="w-1 h-2 sm:h-3 bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full animate-pulse" style={{animationDuration: '1.5s'}}></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 sm:py-32 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950 dark:via-blue-900 dark:to-blue-800">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 left-20 w-28 h-28 bg-blue-300/15 dark:bg-blue-200/25 rounded-full blur-lg animate-float" style={{animationDelay: '1s', animationDuration: '9s'}}></div>
          <div className="absolute bottom-40 right-20 w-32 h-32 bg-blue-400/10 dark:bg-blue-300/20 rounded-full blur-xl animate-float" style={{animationDelay: '3s', animationDuration: '11s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-500/8 dark:bg-blue-400/15 rounded-full blur-md animate-float" style={{animationDelay: '5s', animationDuration: '10s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 sm:mb-20 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-gray-100 mb-6 animate-slide-up">
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">المميزات</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
              اكتشف كيف تساعدك منصتنا في تطوير مسيرتك المهنية وتوسيع شبكة علاقاتك في المجال الصيدلاني
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {/* Feature 1 */}
            <div className="group animate-scale-in" style={{animationDelay: '0.4s'}}>
              <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 rounded-2xl p-6 sm:p-8 shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:bg-white/30 dark:hover:bg-gray-800/30">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
                  شبكة مهنية واسعة
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                  تواصل مع آلاف الصيادلة وأصحاب الصيدليات في جميع أنحاء المنطقة وابني شبكة علاقات مهنية قوية
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group animate-scale-in" style={{animationDelay: '0.6s'}}>
              <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 rounded-2xl p-6 sm:p-8 shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:bg-white/30 dark:hover:bg-gray-800/30">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
                  فرص عمل مضمونة
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                  احصل على فرص عمل موثوقة ومتنوعة مع إمكانية اختيار المواعيد والمواقع التي تناسبك
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group animate-scale-in" style={{animationDelay: '0.8s'}}>
              <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 rounded-2xl p-6 sm:p-8 shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:bg-white/30 dark:hover:bg-gray-800/30">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
                  دخل إضافي مرن
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                  زد دخلك من خلال العمل في أوقات فراغك مع نظام دفع شفاف وآمن
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group animate-scale-in" style={{animationDelay: '1.0s'}}>
              <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 rounded-2xl p-6 sm:p-8 shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:bg-white/30 dark:hover:bg-gray-800/30">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
                  إدارة ذكية للاشتراكات
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                  نظام إدارة متطور للاشتراكات والمدفوعات مع تقارير مفصلة وإحصائيات دقيقة
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group animate-scale-in" style={{animationDelay: '1.2s'}}>
              <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 rounded-2xl p-6 sm:p-8 shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:bg-white/30 dark:hover:bg-gray-800/30">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
                  أمان وموثوقية
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                  منصة آمنة ومشفرة بالكامل مع نظام تقييم شامل لضمان جودة الخدمة
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group animate-scale-in" style={{animationDelay: '1.4s'}}>
              <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 rounded-2xl p-6 sm:p-8 shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:bg-white/30 dark:hover:bg-gray-800/30">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
                  سرعة في الاستجابة
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                  احصل على استجابة فورية لطلباتك مع إشعارات فورية ونظام تواصل مباشر
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 sm:mt-20 animate-fade-in" style={{animationDelay: '1.6s'}}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Link 
                href="/auth/register/pharmacist" 
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 sm:px-12 py-4 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-400/30 hover:-translate-y-1 w-full sm:w-auto min-w-[280px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center justify-center space-x-3 space-x-reverse">
                  <span>ابدأ رحلتك الآن</span>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 7l-5 5m0 0l5 5m-5-5h14" />
                  </svg>
                </span>
              </Link>
              
              <Link 
                href="#how-it-works" 
                className="group relative overflow-hidden backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border-2 border-white/30 dark:border-gray-700/30 text-gray-900 dark:text-gray-100 px-8 sm:px-12 py-4 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-500 shadow-lg hover:shadow-xl hover:bg-white/30 dark:hover:bg-gray-800/30 hover:-translate-y-1 w-full sm:w-auto min-w-[280px]"
              >
                <span className="relative z-10 flex items-center justify-center space-x-3 space-x-reverse">
                  <span>تعرف على المزيد</span>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <div className="flex items-center justify-center gap-2">
              <a 
                href="https://www.linkedin.com/in/ozidan/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-300"
              >
                <svg 
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>

              <p>&copy; 2025 جميع الحقوق محفوظة</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
