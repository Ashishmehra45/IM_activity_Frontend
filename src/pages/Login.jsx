import React, { useState } from 'react';
import { 
  Mail, Lock, User, ArrowRight, ShieldCheck, 
  Activity, Briefcase, Building
} from 'lucide-react';

const MPIDCAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-emerald-200">
      
      {/* 🚀 LEFT PANEL: Premium Branding (Visible on Desktop) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 lg:p-20 border-r border-slate-800">
        {/* Background Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full"></div>

        {/* Top Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">MPIDC</h2>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-[0.3em]">Internal Portal</p>
            </div>
          </div>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Manage state operations with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">precision.</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
            Secure access to the Madhya Pradesh Industrial Development Corporation internal tracking, tasks, and analytics dashboard.
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center font-bold text-white text-xs">JD</div>
              <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-orange-500 flex items-center justify-center font-bold text-white text-xs">RS</div>
              <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-blue-500 flex items-center justify-center font-bold text-white text-xs">PS</div>
            </div>
            <p className="text-sm font-semibold text-slate-300">Joined by 150+ <br/> Field Officers & Admins</p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 text-slate-500 text-sm font-medium">
          &copy; 2026 MPIDC Govt. of Madhya Pradesh. Secure System.
        </div>
      </div>

      {/* 🚀 RIGHT PANEL: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        
        {/* Mobile Logo (Only visible on small screens) */}
        <div className="absolute top-8 left-6 lg:hidden flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900">MPIDC</h2>
        </div>

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Form Header */}
          <div className="mb-10 text-center lg:text-left mt-10 lg:mt-0">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isLogin ? 'Enter your credentials to access the portal.' : 'Register to join the internal network.'}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            
            {/* Name Field (Only for Register) */}
            {!isLogin && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium shadow-sm"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="officer@mpidc.gov.in" 
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">Password</label>
                {isLogin && <a href="#" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Forgot password?</a>}
              </div>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium shadow-sm"
                />
              </div>
            </div>

           {!isLogin && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-bold text-slate-700">Designation / Post</label>
                <div className="relative">
                  <Briefcase size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. Senior Auditor, Land Inspector" 
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium shadow-sm"
                  />
                </div>
              </div>
            )}  

            {/* Submit Button */}
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-base hover:bg-emerald-600 transition-all duration-300 shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20 mt-4 flex items-center justify-center gap-2 group">
              {isLogin ? 'Sign In ' : 'Create Account'} 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

           

        
          </div>

          {/* Toggle Login/Register */}
          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              {isLogin ? "Don't have portal access? " : "Already registered? "}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-slate-900 font-bold hover:text-emerald-600 transition-colors ml-1"
              >
                {isLogin ? 'Request Account' : 'Sign in '}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MPIDCAuth;