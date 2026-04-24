import React, { useState, useMemo, useEffect } from "react";
import axios from "axios"; // 👈 API call ke liye
import { API_BASE_URL } from "../config/config"; // 👈 Tera config
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle,
  Clock,
  Send,
  ChevronRight,
  ArrowLeft,
  PlusCircle,
  Activity,
  Bell,
  AlertCircle,
  Search,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MPIDCTracker = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filterStatus, setFilterStatus] = useState("All");
  const [user, setUser] = useState({ name: "", designation: "", _id: "" });
  const [tasks, setTasks] = useState([]); // 👈 Dummy data hat gaya, ab array empty hai
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔥 1. PEHLE FUNCTION BANAO (Upar rakhna zaroori hai)
  const fetchMyTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      // Secure URL bina kisi ID ke
      const res = await axios.get(`${API_BASE_URL}/employees/my-tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Tasks fetch error", error);
      toast.error("Aapke tasks load nahi ho paaye.");
      setLoading(false);
    }
  };

  // 🔥 2. PHIR USE-EFFECT MEIN CALL KARO
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        fetchMyTasks(); // 👈 Ab React error nahi dega kyunki function upar ban chuka hai!
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    } else {
      navigate("/login"); 
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  // 🔄 TASK STATUS UPDATE FUNCTION
  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      
      // Backend ko request bhejo status update karne ke liye
      const res = await axios.put(
        `${API_BASE_URL}/employees/update-task/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        toast.success(`Task marked as ${newStatus} ✅`);
        
        // Bina page refresh kiye, local state me data update kar do
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t._id === taskId ? { ...t, status: newStatus } : t
          )
        );
      }
    } catch (error) {
      console.error("Status update fail:", error);
      toast.error("Status update nahi ho paya. Dobara try karein.");
    }
  };

  // 📊 3. LIVE STATS CALCULATION (Database se aaye tasks ke hisaab se)
  const pendingCount = tasks.filter((t) => t.status === "Pending" || t.status === "Overdue").length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;
  const inProgressCount = tasks.filter((t) => t.status === "In Progress").length;

  // 🔍 4. FILTERING TASKS
  const filteredTasks = useMemo(() => {
    if (filterStatus === "All") return tasks;
    return tasks.filter((t) => t.status === filterStatus);
  }, [filterStatus, tasks]);

  // Dummy Notifications (Isko aage chal ke dynamic karenge)
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleStatClick = (status) => {
    setFilterStatus(status);
    setActiveTab("tasks");
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans selection:bg-blue-200">
      {/* 🚀 Desktop Sidebar (Premium Dark Mode) */}
      <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 text-white hidden md:flex flex-col p-8 sticky top-0 h-screen border-r border-slate-800 shadow-2xl z-20">
        <div className="mb-14 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 relative">
            <Activity size={24} className="text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-slate-900 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              MPIDC
            </h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em]">
              Officer Portal
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setFilterStatus("All");
            }}
            className={`w-full flex items-center space-x-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 font-medium ${activeTab === "dashboard" ? "bg-white/10 text-white shadow-inner backdrop-blur-md border border-white/10" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
          >
            <LayoutDashboard size={22} className={activeTab === "dashboard" ? "text-blue-400" : ""} />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab("tasks")}
            className={`w-full flex items-center space-x-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 font-medium ${activeTab === "tasks" ? "bg-white/10 text-white shadow-inner backdrop-blur-md border border-white/10" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
          >
            <ClipboardList size={22} className={activeTab === "tasks" ? "text-blue-400" : ""} />
            <span>My Tasks</span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 font-medium ${activeTab === "notifications" ? "bg-white/10 text-white shadow-inner backdrop-blur-md border border-white/10" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
          >
            <div className="flex items-center space-x-4">
              <Bell size={22} className={activeTab === "notifications" ? "text-blue-400" : ""} />
              <span>Alerts</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg shadow-blue-500/40">
                {unreadCount}
              </span>
            )}
          </button>
        </nav>

        {/* 👤 Sidebar Profile & Logout */}
        <div className="mt-auto pt-8 border-t border-white/10">
          <div className="flex items-center justify-between group p-2 -ml-2 rounded-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-blue-500 flex items-center justify-center font-bold text-sm text-white uppercase">
                {user.name ? user.name[0] : "O"}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-sm font-bold text-white truncate w-24">
                  {user.name || "Officer"}
                </p>
                <p className="text-[10px] text-slate-400 uppercase truncate">
                  {user?.designation || "Field Officer"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* 🚀 Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ✨ Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
              <Activity size={18} className="text-white" />
            </div>
            <h2 className="text-xl font-black text-slate-900">MPIDC</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-600 transition-colors">
              <LogOut size={22} />
            </button>
            <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700 shadow-sm uppercase">
              {user.name ? user.name[0] : "O"}
            </div>
          </div>
        </header>

        {/* ✨ Desktop Top Header */}
        <header className="hidden md:flex sticky top-0 z-30 bg-[#F8FAFC]/80 backdrop-blur-xl px-12 py-6 items-center justify-between">
          <div className="relative w-80 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search your tasks..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)] placeholder:text-slate-400 font-medium"
            />
          </div>
          <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <Clock size={16} className="text-blue-500" />
            <span>
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </header>

        {/* 🚀 Main Scrolling Area */}
        <main className="flex-1 pb-28 md:pb-12 overflow-y-auto">
          <div className="p-5 md:px-12 md:py-2 max-w-5xl mx-auto">
            
            {/* 📊 DASHBOARD VIEW */}
            {activeTab === "dashboard" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-2 md:mt-0">
                <header className="mb-8">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-widest">
                      Welcome back, {user?.name || "Officer"}
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                      My Daily Overview
                    </h1>
                  </div>
                </header>

                {/* ✨ Live Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-8">
                  <div onClick={() => handleStatClick("Pending")} className="cursor-pointer group bg-white p-6 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Pending</p>
                        <h3 className="text-3xl font-semibold text-slate-900">
                          {pendingCount < 10 ? `0${pendingCount}` : pendingCount}
                        </h3>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl text-orange-500 group-hover:bg-orange-50 transition-colors duration-200">
                        <Clock size={24} strokeWidth={2} />
                      </div>
                    </div>
                  </div>

                  <div onClick={() => handleStatClick("Completed")} className="cursor-pointer group bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Completed</p>
                        <h3 className="text-3xl font-semibold text-slate-900">
                          {completedCount < 10 ? `0${completedCount}` : completedCount}
                        </h3>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl text-emerald-500 group-hover:bg-emerald-50 transition-colors duration-200">
                        <CheckCircle size={24} strokeWidth={2} />
                      </div>
                    </div>
                  </div>

                  <div onClick={() => handleStatClick("In Progress")} className="cursor-pointer group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">In Progress</p>
                        <h3 className="text-3xl font-semibold text-slate-900">
                          {inProgressCount < 10 ? `0${inProgressCount}` : inProgressCount}
                        </h3>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-50 transition-colors duration-200">
                        <Send size={24} strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✨ Recent Tasks Snapshot */}
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-900">Recent Assignments</h3>
                    <button onClick={() => setActiveTab("tasks")} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center group transition-colors">
                      View All <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {loading ? (
                      <p className="text-slate-400 text-center py-4">Loading your tasks...</p>
                    ) : tasks.length > 0 ? (
                      tasks.slice(0, 3).map((t) => (
                        <div key={t._id} onClick={() => setActiveTab("tasks")} className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all duration-300 flex items-center justify-between cursor-pointer">
                          <div className="flex items-center space-x-4">
                            <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${t.status?.toLowerCase() === "completed" ? "bg-emerald-50 text-emerald-500" : t.status?.toLowerCase() === "pending" ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-500"}`}>
                              {t.status?.toLowerCase() === "completed" && <CheckCircle size={20} className="md:w-6 md:h-6" />}
                              {t.status?.toLowerCase() === "pending" && <Clock size={20} className="md:w-6 md:h-6" />}
                              {t.status?.toLowerCase() === "in progress" && <Activity size={20} className="md:w-6 md:h-6" />}
                            </div>
                            <div>
                              <h4 className="text-base md:text-lg font-bold text-slate-800 mb-1">
                                {t.title} {/* 👈 Mongoose se aayi title field */}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs font-semibold text-slate-400">
                                <span className="flex items-center bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                  <Clock size={12} className="mr-1.5" /> {new Date(t.createdAt).toLocaleDateString()}
                                </span>
                                <span className={`px-2 py-1 rounded-md border ${t.status?.toLowerCase() === "completed" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : t.status?.toLowerCase() === "pending" ? "text-orange-600 bg-orange-50 border-orange-100" : "text-blue-600 bg-blue-50 border-blue-100"}`}>
                                  {t.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-slate-300 border border-slate-100 group-hover:border-blue-600">
                            <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-slate-400 font-medium">
                        You have no assigned tasks yet. Relax! ☕
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

           {/* 📋 TASKS VIEW */}
            {activeTab === "tasks" && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 mt-2 md:mt-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                  <div>
                    <button onClick={() => { setActiveTab("dashboard"); setFilterStatus("All"); }} className="flex items-center text-slate-400 font-semibold text-sm mb-4 hover:text-blue-600 transition-colors group">
                      <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Overview
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                      {filterStatus === "All" ? "All Assignments" : `${filterStatus} Tasks`}
                    </h1>
                  </div>

                  <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto hide-scrollbar">
                    {["All", "Pending", "In Progress", "Completed"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filterStatus === s ? "bg-white text-slate-900 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-700"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {loading ? (
                     <div className="text-center p-10 font-bold text-slate-400 animate-pulse">Loading tasks from database...</div>
                  ) : filteredTasks.length > 0 ? (
                    filteredTasks.map((t) => (
                      // 👇 YAHAN SE TERA NAYA CARD SHURU HOTA HAI
                      <div key={t._id} className="group bg-white p-5 md:p-6 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer">
                        
                        <div className="flex items-center space-x-5">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${t.status?.toLowerCase() === "completed" ? "bg-emerald-50 text-emerald-500" : t.status?.toLowerCase() === "pending" ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-500"}`}>
                            {t.status?.toLowerCase() === "completed" && <CheckCircle size={24} />}
                            {t.status?.toLowerCase() === "pending" && <Clock size={24} />}
                            {t.status?.toLowerCase() === "in progress" && <Activity size={24} />}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-800 mb-1">{t.title}</h4>
                            <p className="text-sm text-slate-500 mb-2">{t.description}</p>
                            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400">
                              <span className="flex items-center bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                <Clock size={12} className="mr-1.5" /> {new Date(t.createdAt).toLocaleDateString()}
                              </span>
                              <span className={`px-2.5 py-1 rounded-md border ${t.priority === "High" ? "text-red-600 border-red-200 bg-red-50" : t.priority === "Medium" ? "text-orange-600 border-orange-200 bg-orange-50" : "text-blue-600 border-blue-200 bg-blue-50"}`}>
                                {t.priority} Priority
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 👇 YAHAN TERA STATUS UPDATE DROPDOWN HAI */}
                        <div className="flex items-center justify-end w-full md:w-auto mt-2 md:mt-0">
                          <select
                            value={t.status}
                            onChange={(e) => handleStatusUpdate(t._id, e.target.value)}
                            onClick={(e) => e.stopPropagation()} 
                            className={`appearance-none cursor-pointer outline-none font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl border-2 transition-all duration-300 shadow-sm
                              ${t.status === "Completed" 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" 
                                : t.status === "In Progress" 
                                ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100" 
                                : "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                              }
                            `}
                          >
                            <option value="Pending" className="text-slate-700 font-semibold bg-white">⌛ Pending</option>
                            <option value="In Progress" className="text-slate-700 font-semibold bg-white">🚀 In Progress</option>
                            <option value="Completed" className="text-slate-700 font-semibold bg-white">✅ Completed</option>
                          </select>
                        </div>

                      </div>
                    ))
                  ) : (
                    <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-200">
                      <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <CheckCircle size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">No tasks found</h3>
                      <p className="text-slate-400 font-medium">You have zero {filterStatus.toLowerCase()} tasks right now.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications baaki tabs same rahenge */}
          </div>
        </main>
      </div>
      
      {/* 🚀 Mobile Bottom Navigation (Smart Glassmorphism) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50">
        <nav className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_10px_40px_rgb(0,0,0,0.1)] rounded-full p-2 flex relative">
          <button onClick={() => { setActiveTab("dashboard"); setFilterStatus("All"); }} className={`flex-1 relative z-10 flex flex-col items-center justify-center py-2.5 rounded-full transition-colors duration-300 ${activeTab === "dashboard" ? "text-blue-600 bg-blue-50" : "text-slate-500 hover:text-slate-800"}`}>
            <LayoutDashboard size={22} strokeWidth={2.5} className="mb-1" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Home</span>
          </button>
          <button onClick={() => setActiveTab("tasks")} className={`flex-1 relative z-10 flex flex-col items-center justify-center py-2.5 rounded-full transition-colors duration-300 ${activeTab === "tasks" ? "text-blue-600 bg-blue-50" : "text-slate-500 hover:text-slate-800"}`}>
            <ClipboardList size={22} strokeWidth={2.5} className="mb-1" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Tasks</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default MPIDCTracker;