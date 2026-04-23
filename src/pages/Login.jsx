import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Mail, Lock, User, ArrowRight, ShieldCheck, 
  Briefcase, Building
} from 'lucide-react';
import API_BASE_URL from '../config/config';

const MPIDCAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    designation: ''
  });

  const { name, email, password, designation } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? '/api/employees/login' : '/api/employees/register';
    
    try {
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, formData);

      if (isLogin) {
        // Login Logic
        toast.success(`Welcome back, ${res.data.user.name}!`);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        // Redirect based on role
        setTimeout(() => {
          if (res.data.user.role === 'Admin') navigate('/admin');
          else navigate('/dashboard');
        }, 1500);
      } else {
        // Register Logic
        toast.success("Registration successful! Wait for Admin approval.", {
          duration: 5000,
        });
        setIsLogin(true); // Switch to login after registration
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-emerald-200">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* 🚀 LEFT PANEL (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 border-r border-slate-800">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full"></div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">MPIDC</h2>
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-[0.3em]">Internal Portal</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Industrial Excellence with <span className="text-emerald-400">Digital Tracking.</span>
          </h1>
          <p className="text-slate-400 text-lg">Secure access for MPIDC field officers and administrators.</p>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          &copy; 2026 MPIDC Govt. of MP. All rights reserved.
        </div>
      </div>

      {/* 🚀 RIGHT PANEL: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-slate-500">
              {isLogin ? 'Enter credentials to access the portal.' : 'Register for internal network access.'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="name" value={name} onChange={onChange} required type="text" placeholder="John Doe" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="email" value={email} onChange={onChange} required type="email" placeholder="officer@mpidc.gov.in" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="password" value={password} onChange={onChange} required type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Designation / Post</label>
                <div className="relative">
                  <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="designation" value={designation} onChange={onChange} required type="text" placeholder="e.g. Senior Auditor" className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
                </div>
              </div>
            )}

            <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group disabled:opacity-70">
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Request Account')} 
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500">
              {isLogin ? "Don't have access? " : "Already registered? "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-slate-900 font-bold hover:text-emerald-600 underline-offset-4 hover:underline">
                {isLogin ? 'Request Account' : 'Back to Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MPIDCAuth;