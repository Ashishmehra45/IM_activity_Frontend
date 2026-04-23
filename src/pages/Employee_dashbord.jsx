import React, { useState, useMemo } from "react";
import { useEffect } from "react";
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
  const [user, setUser] = useState({ name: "", designation: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const [tasks, setTasks] = useState([
    {
      id: 1,
      task: "Industrial Land Allotment Review",
      status: "Completed",
      progress: "100%",
      date: "14 Apr '26",
      priority: "High",
    },
    {
      id: 2,
      task: "Pithampur Sector 7 Inspection",
      status: "In Progress",
      progress: "65%",
      date: "14 Apr '26",
      priority: "Medium",
    },
    {
      id: 3,
      task: "Mandideep Unit B Clearance",
      status: "Pending",
      progress: "0%",
      date: "15 Apr '26",
      priority: "Low",
    },
    {
      id: 4,
      task: "GST Compliance Audit",
      status: "Pending",
      progress: "0%",
      date: "16 Apr '26",
      priority: "High",
    },
  ]);

  // Premium Dummy Notifications Data
  const [notifications, setNotifications] = useState([
    {
      id: 101,
      title: "New Task Assigned",
      message:
        "You have been assigned 'Gwalior Zone Survey'. Please check the requirements.",
      time: "10 mins ago",
      type: "new",
      unread: true,
    },
    {
      id: 102,
      title: "Status Updated",
      message: "Mandideep Unit B Clearance has been moved to In Progress.",
      time: "2 hours ago",
      type: "update",
      unread: true,
    },
    {
      id: 103,
      title: "Deadline Approaching",
      message: "GST Compliance Audit is due in 24 hours. Please expedite.",
      time: "1 day ago",
      type: "alert",
      unread: false,
    },
    {
      id: 104,
      title: "Report Approved",
      message: "Your Phase 1 Land Allotment report has been verified.",
      time: "2 days ago",
      type: "success",
      unread: false,
    },
  ]);

  const filteredTasks = useMemo(() => {
    if (filterStatus === "All") return tasks;
    return tasks.filter((t) => t.status === filterStatus);
  }, [filterStatus, tasks]);

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
              Portal
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
            <LayoutDashboard
              size={22}
              className={activeTab === "dashboard" ? "text-blue-400" : ""}
            />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`w-full flex items-center space-x-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 font-medium ${activeTab === "tasks" ? "bg-white/10 text-white shadow-inner backdrop-blur-md border border-white/10" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
          >
            <ClipboardList
              size={22}
              className={activeTab === "tasks" ? "text-blue-400" : ""}
            />
            <span>My Tasks</span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 font-medium ${activeTab === "notifications" ? "bg-white/10 text-white shadow-inner backdrop-blur-md border border-white/10" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
          >
            <div className="flex items-center space-x-4">
              <Bell
                size={22}
                className={activeTab === "notifications" ? "text-blue-400" : ""}
              />
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
              {/* User Initial Circle */}
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-blue-500 flex items-center justify-center font-bold text-sm text-white">
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

            {/* 🚪 Logout Icon Button */}
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
        {/* ✨ Mobile Top Header (Sticky) */}
        {/* ✨ Mobile Header with Logout */}
        <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
              <Activity size={18} className="text-white" />
            </div>
            <h2 className="text-xl font-black text-slate-900">MPIDC</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* 🚪 Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={22} />
            </button>
            <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700 shadow-sm">
              {user.name ? user.name[0] : "O"}
            </div>
          </div>
        </header>

        {/* ✨ Desktop Top Header (Sticky) */}
        <header className="hidden md:flex sticky top-0 z-30 bg-[#F8FAFC]/80 backdrop-blur-xl px-12 py-6 items-center justify-between">
          <div className="relative w-80 group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Search assignments or tasks..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)] placeholder:text-slate-400 font-medium"
            />
          </div>
          <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <Clock size={16} className="text-blue-500" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* 🚀 Main Scrolling Area */}
        <main className="flex-1 pb-28 md:pb-12 overflow-y-auto">
          <div className="p-5 md:px-12 md:py-2 max-w-5xl mx-auto">
            {/* DASHBOARD VIEW (Simple Premium) */}
            {activeTab === "dashboard" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-2 md:mt-0">
                <header className="mb-8">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-widest">
                      Welcome back, {user?.name || "Officer"}
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                      Daily Overview
                    </h1>
                  </div>
                </header>

                {/* ✨ Simple Premium Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-8">
                  <div
                    onClick={() => handleStatClick("Pending")}
                    className="cursor-pointer group bg-white p-6 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">
                          Pending
                        </p>
                        <h3 className="text-3xl font-semibold text-slate-900">
                          02
                        </h3>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl text-orange-500 group-hover:bg-orange-50 transition-colors duration-200">
                        <Clock size={24} strokeWidth={2} />
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleStatClick("Completed")}
                    className="cursor-pointer group bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">
                          Completed
                        </p>
                        <h3 className="text-3xl font-semibold text-slate-900">
                          01
                        </h3>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl text-emerald-500 group-hover:bg-emerald-50 transition-colors duration-200">
                        <CheckCircle size={24} strokeWidth={2} />
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleStatClick("In Progress")}
                    className="cursor-pointer group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">
                          In Progress
                        </p>
                        <h3 className="text-3xl font-semibold text-slate-900">
                          01
                        </h3>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-50 transition-colors duration-200">
                        <Send size={24} strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✨ Minimal Log Entry Form */}
                <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] mb-8">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="text-blue-600">
                      <PlusCircle size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Log New Progress
                    </h3>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="What did you work on today?"
                      className="flex-1 px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 text-base font-medium"
                    />
                    <button className="md:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2 group shadow-md shadow-slate-900/10 hover:shadow-blue-500/20">
                      Submit{" "}
                      <ChevronRight
                        size={18}
                        className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                      />
                    </button>
                  </div>
                </section>

                {/* ✨ NEW: Recent Tasks Snapshot */}
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-900">
                      Recent Assignments
                    </h3>
                    <button
                      onClick={() => setActiveTab("tasks")}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center group transition-colors"
                    >
                      View All{" "}
                      <ChevronRight
                        size={16}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Showing top 2 tasks directly on the dashboard */}
                    {tasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setActiveTab("tasks")}
                        className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all duration-300 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${t.status === "Completed" ? "bg-emerald-50 text-emerald-500" : t.status === "Pending" ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-500"}`}
                          >
                            {t.status === "Completed" && (
                              <CheckCircle
                                size={20}
                                className="md:w-6 md:h-6"
                              />
                            )}
                            {t.status === "Pending" && (
                              <Clock size={20} className="md:w-6 md:h-6" />
                            )}
                            {t.status === "In Progress" && (
                              <Activity size={20} className="md:w-6 md:h-6" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-base md:text-lg font-bold text-slate-800 mb-1">
                              {t.task}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs font-semibold text-slate-400">
                              <span className="flex items-center bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                <Clock size={12} className="mr-1.5" /> {t.date}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-md border ${t.status === "Completed" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : t.status === "Pending" ? "text-orange-600 bg-orange-50 border-orange-100" : "text-blue-600 bg-blue-50 border-blue-100"}`}
                              >
                                {t.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-slate-300 border border-slate-100 group-hover:border-blue-600">
                          <ChevronRight
                            size={18}
                            className="group-hover:translate-x-0.5 transition-transform"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* TASKS VIEW */}
            {activeTab === "tasks" && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 mt-2 md:mt-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                  <div>
                    <button
                      onClick={() => {
                        setActiveTab("dashboard");
                        setFilterStatus("All");
                      }}
                      className="flex items-center text-slate-400 font-semibold text-sm mb-4 hover:text-blue-600 transition-colors group"
                    >
                      <ArrowLeft
                        size={16}
                        className="mr-2 group-hover:-translate-x-1 transition-transform"
                      />{" "}
                      Back to Overview
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                      {filterStatus === "All"
                        ? "All Assignments"
                        : `${filterStatus} Tasks`}
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
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((t) => (
                      <div
                        key={t.id}
                        className="group bg-white p-5 md:p-6 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-300 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center space-x-5">
                          <div
                            className={`flex items-center justify-center w-12 h-12 rounded-2xl ${t.status === "Completed" ? "bg-emerald-50 text-emerald-500" : t.status === "Pending" ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-500"}`}
                          >
                            {t.status === "Completed" && (
                              <CheckCircle size={24} />
                            )}
                            {t.status === "Pending" && <Clock size={24} />}
                            {t.status === "In Progress" && (
                              <Activity size={24} />
                            )}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-800 mb-1">
                              {t.task}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400">
                              <span className="flex items-center bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                <Clock size={12} className="mr-1.5" /> {t.date}
                              </span>
                              <span
                                className={`px-2.5 py-1 rounded-md border ${t.status === "Completed" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : t.status === "Pending" ? "text-orange-600 bg-orange-50 border-orange-100" : "text-blue-600 bg-blue-50 border-blue-100"}`}
                              >
                                {t.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-slate-300 border border-slate-100 group-hover:border-blue-600">
                          <ChevronRight
                            size={20}
                            className="group-hover:translate-x-0.5 transition-transform"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-200">
                      <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <CheckCircle size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        No tasks found
                      </h3>
                      <p className="text-slate-400 font-medium">
                        You have zero {filterStatus.toLowerCase()} tasks right
                        now.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 🔔 NOTIFICATIONS VIEW */}
            {activeTab === "notifications" && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 mt-2 md:mt-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                  <div>
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className="flex items-center text-slate-400 font-semibold text-sm mb-4 hover:text-blue-600 transition-colors group"
                    >
                      <ArrowLeft
                        size={16}
                        className="mr-2 group-hover:-translate-x-1 transition-transform"
                      />{" "}
                      Back to Overview
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="bg-red-50 text-red-600 border border-red-100 text-sm px-3 py-1 rounded-xl font-bold">
                          {unreadCount} New
                        </span>
                      )}
                    </h1>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`relative group bg-white p-5 md:p-6 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:shadow-md ${notif.unread ? "border-blue-200 bg-blue-50/20" : "border-slate-200 hover:border-blue-200"}`}
                    >
                      {/* Unread dot */}
                      {notif.unread && (
                        <div className="absolute top-6 left-3 w-2 h-2 rounded-full bg-blue-500 animate-pulse hidden md:block"></div>
                      )}

                      <div className="flex items-start md:items-center space-x-4 md:space-x-5 pl-0 md:pl-4">
                        <div
                          className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl border ${
                            notif.type === "new"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : notif.type === "alert"
                                ? "bg-red-50 text-red-600 border-red-100"
                                : notif.type === "success"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : "bg-slate-50 text-slate-600 border-slate-100"
                          }`}
                        >
                          {notif.type === "new" && <Bell size={22} />}
                          {notif.type === "alert" && <AlertCircle size={22} />}
                          {notif.type === "success" && (
                            <CheckCircle size={22} />
                          )}
                          {notif.type === "update" && <Activity size={22} />}
                        </div>

                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                            <h4
                              className={`text-lg font-bold ${notif.unread ? "text-slate-900" : "text-slate-700"}`}
                            >
                              {notif.title}
                            </h4>
                            <span className="text-xs font-semibold text-slate-400 flex items-center">
                              <Clock size={12} className="mr-1" /> {notif.time}
                            </span>
                          </div>
                          <p
                            className={`text-sm ${notif.unread ? "text-slate-600 font-medium" : "text-slate-500"}`}
                          >
                            {notif.message}
                          </p>
                        </div>
                      </div>

                      <button
                        className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${notif.unread ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                      >
                        View Task
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 🚀 Mobile Bottom Navigation (Smart Glassmorphism) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50">
        <nav className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_10px_40px_rgb(0,0,0,0.1)] rounded-full p-2 flex relative">
          <div className="absolute inset-y-2 left-2 right-2 z-0 flex">
            <div
              className={`w-1/3 bg-slate-900 rounded-full transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                activeTab === "dashboard"
                  ? "translate-x-0"
                  : activeTab === "tasks"
                    ? "translate-x-full"
                    : "translate-x-[200%]"
              }`}
            ></div>
          </div>

          <button
            onClick={() => {
              setActiveTab("dashboard");
              setFilterStatus("All");
            }}
            className={`flex-1 relative z-10 flex flex-col items-center justify-center py-2.5 rounded-full transition-colors duration-300 ${activeTab === "dashboard" ? "text-white" : "text-slate-500 hover:text-slate-800"}`}
          >
            <LayoutDashboard size={22} strokeWidth={2.5} className="mb-1" />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Home
            </span>
          </button>

          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex-1 relative z-10 flex flex-col items-center justify-center py-2.5 rounded-full transition-colors duration-300 ${activeTab === "tasks" ? "text-white" : "text-slate-500 hover:text-slate-800"}`}
          >
            <ClipboardList size={22} strokeWidth={2.5} className="mb-1" />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Tasks
            </span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex-1 relative z-10 flex flex-col items-center justify-center py-2.5 rounded-full transition-colors duration-300 ${activeTab === "notifications" ? "text-white" : "text-slate-500 hover:text-slate-800"}`}
          >
            <div className="relative">
              <Bell size={22} strokeWidth={2.5} className="mb-1" />
              {unreadCount > 0 && activeTab !== "notifications" && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Alerts
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default MPIDCTracker;
