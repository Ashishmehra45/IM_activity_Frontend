import React, { useState, useMemo } from "react";
import axios from "axios";
import API_BASE_URL from "../config/config"; // 👈 API base URL import karo
import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  Activity,
  Search,
  ChevronRight,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ShieldCheck,
  Bell,
  AlertTriangle,
  ArrowLeft,
  Send,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // 👈 Toaster add karo

const MPIDCAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [taskFilter, setTaskFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Smart Employee View

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Nayi state sirf us employee ke tasks ke liye
  const [currentEmployeeTasks, setCurrentEmployeeTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
// 1. Tera banaya hua function (Ye theek hai)
  const fetchAllTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/admin/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Backend se ye Tasks aaye:", res.data); // 👈 Browser console me check karne ke liye
      setAllTasks(res.data); 
    } catch (err) {
      console.error("Global tasks fetch error", err);
    }
  };

  // 2. 🔥 YAHAN GAlTI THI: Ise page load par call karna zaroori hai!
  useEffect(() => {
    fetchEmployees();
    fetchAllTasks(); // 👈 Ise add kar de bhai!
  }, []);

  const fetchSpecificTasks = async () => {
    if (!selectedEmployee) return; // Agar koi select nahi hai toh mat chalo
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/admin/employee-tasks/${selectedEmployee._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCurrentEmployeeTasks(res.data); // Sirf uske tasks set ho gaye
    } catch (err) {
      toast.error("Employee tasks fetch karne me error aaya");
    }
  };

  // 2. 🔄 USE-EFFECT MEIN SIRF FUNCTION CALL KARO
  useEffect(() => {
    fetchSpecificTasks();
  }, [selectedEmployee]);

  const calculateCurrentStats = () => {
    return {
      total: currentEmployeeTasks.length,
      completed: currentEmployeeTasks.filter((t) => t.status === "Completed")
        .length,
      inProgress: currentEmployeeTasks.filter((t) => t.status === "In Progress")
        .length,
      pending: currentEmployeeTasks.filter((t) => t.status === "Pending")
        .length,
    };
  };
  const stats = calculateCurrentStats();

  // Pehle se bani states ke paas add karein
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  // 📝 Task Assign Function (Backend API hit karega)
  // 📝 Task Assign Function
  const handleAssignTask = async (e) => {
    e.preventDefault();

    const adminData = JSON.parse(localStorage.getItem("user"));
    const payload = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      assignedTo: selectedEmployee?._id || selectedEmployee?.id,
      assignedBy: adminData?._id || adminData?.id,
    };

    // Pehle hi check kar lo taaki faltu API hit na ho
    if (!payload.assignedTo || !payload.assignedBy) {
      return toast.error("System Error: IDs missing hain!");
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/admin/assign-task`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // ✅ SIRF SUCCESS: Agar backend se status 200/201 aaya
      if (res.status === 201 || res.status === 200) {
        toast.success("Task Successfully Assigned! 🚀");
        setIsModalOpen(false);
        setTaskData({ title: "", description: "", priority: "Medium" }); // Form reset
        await fetchSpecificTasks();
        await fetchAllTasks();
      }
    } catch (err) {
      // ❌ SIRF FAIL: Agar error aaya toh sirf ye chalega
      console.error("Task Assign Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Task Assignment Failed! ❌");
    }
  };
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data); // Backend se array aayega
      setLoading(false);
    } catch (err) {
      toast.error("Data fetch karne mein dikat aa rahi hai");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  // 🎯 SMART FILTERS (Fiter out Admins)
  const pendingRequests = useMemo(
    () => employees.filter((emp) => !emp.isApproved && emp.role !== "Admin"),
    [employees],
  );

  const approvedStaff = useMemo(
    () => employees.filter((emp) => emp.isApproved && emp.role !== "Admin"),
    [employees],
  );

  // ✅ APPROVE HANDLER
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_BASE_URL}/admin/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        toast.success(res.data.msg);
        // Local state update taaki refresh na karna pade
        setEmployees(
          employees.map((emp) =>
            emp._id === id ? { ...emp, isApproved: true } : emp,
          ),
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Approval failed");
    }
  };

  // ❌ REJECT/DELETE HANDLER
  const handleReject = async (id) => {
    if (!window.confirm("Kya aap is request ko delete karna chahte hain?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/admin/reject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(employees.filter((emp) => emp._id !== id));
      toast.error("Request rejected and removed");
    } catch (err) {
      toast.error("Error in rejecting request");
    }
  };

  // Component ke andar (activeTab state ke paas)
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. LocalStorage saaf karo
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 2. Sweet alert/toast dikhao
    toast.success("Logged out successfully");

    // 3. Login page par bhej do
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  // 🧠 Smart Calculations
  // 🧠 Smart Calculations
 const filteredTasks = useMemo(() => {
    return allTasks.filter((t) => {
      const matchesStatus = taskFilter === "All" || t.status === taskFilter;
      const matchesSearch =
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assignedTo?.name?.toLowerCase().includes(searchQuery.toLowerCase()); // 👈 FIX: Yahan .name add kiya
      return matchesStatus && matchesSearch;
    });
  }, [allTasks, taskFilter, searchQuery]);

 

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setActiveTab("team"); // Stay on team tab but show details
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans selection:bg-emerald-200">
      {/* 🚀 ADMIN Desktop Sidebar */}
      <Toaster position="top-right" reverseOrder={false} />
      <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 text-white hidden md:flex flex-col p-8 sticky top-0 h-screen border-r border-slate-800 shadow-2xl z-20">
        <div className="mb-12 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 relative">
            <ShieldCheck size={24} className="text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-slate-900 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              MPIDC
            </h2>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em]">
              Admin Console
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <button
            onClick={() => {
              setActiveTab("overview");
              setSelectedEmployee(null);
            }}
            className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 font-medium ${activeTab === "overview" ? "bg-white/10 text-white shadow-inner backdrop-blur-md border border-white/10" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
          >
            <LayoutDashboard
              size={22}
              className={activeTab === "overview" ? "text-emerald-400" : ""}
            />
            <span>Overview</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("team");
              setSelectedEmployee(null);
            }}
            className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 font-medium ${activeTab === "team" ? "bg-white/10 text-white shadow-inner backdrop-blur-md border border-white/10" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
          >
            <Users
              size={22}
              className={activeTab === "team" ? "text-emerald-400" : ""}
            />
            <span>Team & Officers</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("tasks");
              setSelectedEmployee(null);
            }}
            className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 font-medium ${activeTab === "tasks" ? "bg-white/10 text-white shadow-inner backdrop-blur-md border border-white/10" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
          >
            <Briefcase
              size={22}
              className={activeTab === "tasks" ? "text-emerald-400" : ""}
            />
            <span>Global Tasks</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("alerts");
              setSelectedEmployee(null);
            }}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 font-medium ${activeTab === "alerts" ? "bg-white/10 text-white shadow-inner backdrop-blur-md border border-white/10" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
          >
            <div className="flex items-center space-x-4">
              <Bell
                size={22}
                className={activeTab === "alerts" ? "text-emerald-400" : ""}
              />
              <span>Activity & Alerts</span>
            </div>
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
              1 New
            </span>
          </button>
        </nav>

        <div className="mt-auto pt-8 border-t border-white/10">
          <div className="flex items-center justify-between group p-2 -ml-2 rounded-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center font-bold text-sm text-white">
                AM
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Ashish Mehra</p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
            </div>

            {/* 💡 Logout Icon Button */}
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
        {/* ✨ Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">
              Admin
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* 💡 Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={22} />
            </button>
            <div className="w-9 h-9 rounded-full bg-slate-50 border-2 border-emerald-500 flex items-center justify-center font-bold text-sm text-slate-700">
              AM
            </div>
          </div>
        </header>

        {/* 🚀 Main Scrolling Area */}
        <main className="flex-1 pb-28 md:pb-12 overflow-y-auto pt-6 md:pt-10">
          <div className="p-5 md:px-12 max-w-6xl mx-auto">
           {/* 📊 OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header className="mb-8">
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Dashboard Overview
                  </h1>
                  <p className="text-slate-500 mt-1">
                    System ke real-time statistics aur updates.
                  </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-8">
                  
                  {/* 🟢 Card 1: Verified Staff */}
                  <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                        <Users size={24} />
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        Active
                      </span>
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 mb-1">
                      {approvedStaff.length}
                    </h3>
                    <p className="text-slate-500 text-sm font-semibold">
                      Verified Officers
                    </p>
                  </div>

                  {/* 🟠 Card 2: Pending Requests */}
                  <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                        <Clock size={24} />
                      </div>
                      {pendingRequests.length > 0 && (
                        <span className="flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-4xl font-black text-orange-600 mb-1">
                      {pendingRequests.length}
                    </h3>
                    <p className="text-slate-500 text-sm font-semibold">
                      Pending Access
                    </p>
                  </div>

                  {/* 🔵 Card 3: Total Global Tasks */}
                  <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Briefcase size={24} />
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                        Overall
                      </span>
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 mb-1">
                      {allTasks?.length || 0}
                    </h3>
                    <p className="text-slate-500 text-sm font-semibold">
                      Total Tasks
                    </p>
                  </div>

                  {/* 🟢 Card 4: Completed Tasks */}
                  <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <CheckCircle size={24} />
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                        Success
                      </span>
                    </div>
                    <h3 className="text-4xl font-black text-emerald-600 mb-1">
                      {allTasks?.filter(t => t.status?.toLowerCase() === 'completed').length || 0}
                    </h3>
                    <p className="text-slate-500 text-sm font-semibold">
                      Completed Tasks
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* 👥 TEAM DIRECTORY TAB */}
            {activeTab === "team" && (
              <div className="animate-in fade-in duration-500">
                {/* 1. Agar koi employee select NAHI hua hai, toh List dikhao */}
                {!selectedEmployee ? (
                  <>
                    {/* 📩 NEW REGISTRATIONS (Pending Requests) */}
                    {pendingRequests.length > 0 && (
                      <div className="mb-10 animate-in slide-in-from-top-4 duration-500">
                        <h3 className="text-sm font-bold text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                          New Access Requests ({pendingRequests.length})
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {pendingRequests.map((req) => (
                            <div
                              key={req._id}
                              className="bg-white border-2 border-orange-100 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xl">
                                  {req.name ? req.name[0] : "?"}
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900">
                                    {req.name}
                                  </h4>
                                  <p className="text-sm text-slate-500">
                                    {req.email} •{" "}
                                    <span className="text-emerald-600 font-bold">
                                      {req.designation}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleApprove(req._id)}
                                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(req._id)}
                                  className="px-6 py-2 bg-white border border-slate-200 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 transition-all"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 👥 APPROVED STAFF DIRECTORY */}
                    <header className="mb-8">
                      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Staff Directory
                      </h1>
                      <p className="text-slate-500 mt-1">
                        Managing {approvedStaff.length} verified officers.
                      </p>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {approvedStaff.length > 0 ? (
                        approvedStaff.map((member) => (
                          <div
                            key={member._id}
                            onClick={() => setSelectedEmployee(member)} // 💡 Fix: Sirf profile kholo, Modal nahi
                            className="cursor-pointer group bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-lg border border-slate-200">
                                {member.name ? member.name[0] : "?"}
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                <span className="text-[10px] font-bold text-emerald-600 mt-1 uppercase">
                                  Approved
                                </span>
                              </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                              {member.name}
                            </h3>
                            <p className="text-sm font-medium text-slate-500 mb-5">
                              {member.designation || "Field Officer"}
                            </p>
                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-slate-400">
                              <span className="text-xs font-bold uppercase">
                                View Profile
                              </span>
                              <ChevronRight
                                size={18}
                                className="group-hover:translate-x-1 transition-all group-hover:text-emerald-500"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                          <Users
                            size={40}
                            className="mx-auto text-slate-300 mb-4"
                          />
                          <p className="text-slate-500 font-medium">
                            No verified staff members found.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <button
                      onClick={() => setSelectedEmployee(null)}
                      className="flex items-center text-slate-500 hover:text-emerald-600 font-semibold text-sm mb-6 transition-colors"
                    >
                      <ArrowLeft size={16} className="mr-2" /> Back to Directory
                    </button>

                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-5">
                          <div className="w-20 h-20 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-3xl shadow-inner border border-slate-200">
                            {selectedEmployee.name
                              ? selectedEmployee.name[0]
                              : "?"}
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-slate-900">
                              {selectedEmployee.name}
                            </h2>
                            <p className="text-slate-500 font-medium mb-2">
                              {selectedEmployee.designation || "Field Officer"}{" "}
                              • {selectedEmployee.email}
                            </p>
                            <span className="px-3 py-1 rounded-full border text-xs font-bold bg-emerald-50 text-emerald-600 border-emerald-100">
                              Status: Active
                            </span>
                          </div>
                        </div>

                        {/* 💡 CREATE TASK BUTTON */}
                        <div className="w-full md:w-auto">
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-200"
                          >
                            <Send size={16} /> Assign New Task
                          </button>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-5">
                        Performance Snapshot
                      </h3>

                      {/* 🔥 LIVE STATS (Naya Code) */}
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-center">
                          <h3 className="text-3xl font-black text-emerald-700">
                            {stats.completed || 0}
                          </h3>
                          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-1">
                            Completed
                          </p>
                        </div>
                        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 text-center">
                          <h3 className="text-3xl font-black text-blue-700">
                            {stats.inProgress || 0}
                          </h3>
                          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-1">
                            In Progress
                          </p>
                        </div>
                        <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 text-center">
                          <h3 className="text-3xl font-black text-orange-700">
                            {stats.pending || 0}
                          </h3>
                          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mt-1">
                            Pending
                          </p>
                        </div>
                      </div>

                      {/* 🔥 LIVE ASLI TASKS KI LIST */}
                      <h3 className="text-xl font-bold text-slate-900 mb-5 border-t border-slate-100 pt-8">
                        Assigned Tasks
                      </h3>

                      <div className="space-y-3">
                        {currentEmployeeTasks.length > 0 ? (
                          currentEmployeeTasks.map((t) => (
                            <div
                              key={t._id}
                              className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all"
                            >
                              <div>
                                {/* 🔥 TITLE & PRIORITY BADGE */}
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="font-bold text-slate-800 text-lg">
                                    {t.title}
                                  </h4>
                                  <span
                                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-wider ${
                                      t.priority === "High"
                                        ? "bg-red-50 text-red-600 border-red-200"
                                        : t.priority === "Medium"
                                          ? "bg-orange-50 text-orange-600 border-orange-200"
                                          : "bg-blue-50 text-blue-600 border-blue-200"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        t.priority === "High"
                                          ? "bg-red-500 animate-pulse"
                                          : t.priority === "Medium"
                                            ? "bg-orange-500"
                                            : "bg-blue-500"
                                      }`}
                                    ></span>
                                    {t.priority} Priority
                                  </span>
                                </div>

                                {/* DESCRIPTION & DATE */}
                                <p className="text-sm text-slate-600 mb-2">
                                  {t.description}
                                </p>
                                <p className="text-xs text-slate-400 font-semibold flex items-center">
                                  <Clock size={12} className="mr-1" /> Assigned:{" "}
                                  {new Date(t.createdAt).toLocaleDateString()}
                                </p>
                              </div>

                              {/* STATUS BADGE */}
                              {/* STATUS BADGE */}
                              <span
                                className={`px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-wider text-center ${
                                  t.status?.toLowerCase().trim() === "completed"
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                    : t.status?.toLowerCase().trim() ===
                                        "in progress"
                                      ? "bg-amber-50 text-amber-600 border-amber-200"
                                      : t.status?.toLowerCase().trim() ===
                                            "pending" ||
                                          t.status?.toLowerCase().trim() ===
                                            "overdue"
                                        ? "bg-red-50 text-red-600 border-red-200 animate-pulse" // 🔴 Pending ke liye Red & Blink
                                        : "bg-slate-50 text-slate-600 border-slate-200"
                                }`}
                              >
                                {t.status}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8">
                            <Briefcase
                              size={32}
                              className="mx-auto text-slate-300 mb-3"
                            />
                            <p className="text-slate-500 font-medium">
                              task not finded for this employee.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 📋 GLOBAL TASKS TAB */}
            {activeTab === "tasks" && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <header className="mb-8">
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Global Tracking
                  </h1>
                  <p className="text-slate-500 mt-1">
                    Sabhi officers ke tasks yahan dikhenge.
                  </p>
                </header>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="divide-y divide-slate-100">
                    {/* 🔥 FIX: globalTasks.map ki jagah allTasks.map use karenge */}
                    {allTasks && allTasks.length > 0 ? (
                      allTasks.map((t) => (
                        <div
                          key={t._id} // t.id ki jagah t._id aayega (MongoDB format)
                          className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                        >
                          <div>
                            {/* 🔥 TITLE & PRIORITY BADGE */}
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-bold text-slate-800 text-lg">
                                {t.title}
                              </h4>
                              <span
                                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-wider ${
                                  t.priority === "High"
                                    ? "bg-red-50 text-red-600 border-red-200"
                                    : t.priority === "Medium"
                                      ? "bg-orange-50 text-orange-600 border-orange-200"
                                      : "bg-blue-50 text-blue-600 border-blue-200"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    t.priority === "High"
                                      ? "bg-red-500 animate-pulse"
                                      : t.priority === "Medium"
                                        ? "bg-orange-500"
                                        : "bg-blue-500"
                                  }`}
                                ></span>
                                {t.priority} Priority
                              </span>
                            </div>

                            {/* 🔥 DESCRIPTION & ASSIGNED OFFICER */}
                            <p className="text-sm text-slate-600 mb-2">
                              {t.description}
                            </p>
                            <p className="text-xs font-semibold text-slate-400 flex items-center flex-wrap gap-y-2">
                              <Users
                                size={12}
                                className="mr-1 text-emerald-500"
                              />
                              Assigned to:{" "}
                              <span className="font-bold text-slate-700 ml-1 mr-4">
                                {t.assignedTo?.name || "Unknown Officer"}
                              </span>
                              <Clock size={12} className="mr-1" />
                              Created:{" "}
                              {new Date(t.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <span
                            className={`px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-wider text-center ${
                              t.status?.toLowerCase().trim() === "completed"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : t.status?.toLowerCase().trim() ===
                                    "in progress"
                                  ? "bg-amber-50 text-amber-600 border-amber-200"
                                  : t.status?.toLowerCase().trim() ===
                                        "pending" ||
                                      t.status?.toLowerCase().trim() ===
                                        "overdue"
                                    ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                                    : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-slate-500 font-medium">
                        <Briefcase
                          size={32}
                          className="mx-auto text-slate-300 mb-3"
                        />
                        No tasks found in the system.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* 🔔 ACTIVITY & NOTIFICATIONS TAB (New Smart Feature) */}
            {activeTab === "alerts" && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <header className="mb-8 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                      Activity Log
                    </h1>
                    <p className="text-slate-500 mt-1">
                      Live updates and system alerts for all officers.
                    </p>
                  </div>
                </header>

                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-5 rounded-2xl border flex gap-4 items-start ${alert.type === "critical" ? "bg-red-50 border-red-200" : alert.type === "warning" ? "bg-orange-50 border-orange-200" : "bg-white border-slate-200"}`}
                    >
                      <div
                        className={`p-2 rounded-xl flex-shrink-0 ${alert.type === "critical" ? "bg-red-100 text-red-600" : alert.type === "warning" ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-600"}`}
                      >
                        {alert.type === "critical" ? (
                          <AlertTriangle size={20} />
                        ) : alert.type === "warning" ? (
                          <Clock size={20} />
                        ) : (
                          <Activity size={20} />
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-bold text-sm md:text-base ${alert.type === "critical" ? "text-red-900" : "text-slate-800"}`}
                        >
                          {alert.text}
                        </p>
                        <p className="text-xs font-semibold text-slate-400 mt-1">
                          {alert.time}
                        </p>
                      </div>
                      {alert.type === "critical" && (
                        <button className="ml-auto hidden md:block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                          Take Action
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 🚀 Mobile Bottom Navigation (4 Tabs) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50">
        <nav className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-full p-2 flex relative">
          <div className="absolute inset-y-2 left-2 right-2 z-0 flex">
            <div
              className={`w-1/4 bg-emerald-500 rounded-full transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                activeTab === "overview"
                  ? "translate-x-0"
                  : activeTab === "team"
                    ? "translate-x-full"
                    : activeTab === "tasks"
                      ? "translate-x-[200%]"
                      : "translate-x-[300%]"
              }`}
            ></div>
          </div>

          <button
            onClick={() => {
              setActiveTab("overview");
              setSelectedEmployee(null);
            }}
            className={`flex-1 relative z-10 flex flex-col items-center justify-center py-2 rounded-full transition-colors duration-300 ${activeTab === "overview" ? "text-white" : "text-slate-400"}`}
          >
            <LayoutDashboard size={20} className="mb-1" />
            <span className="text-[9px] font-bold tracking-widest uppercase">
              Overvw
            </span>
          </button>

          <button
            onClick={() => setActiveTab("team")}
            className={`flex-1 relative z-10 flex flex-col items-center justify-center py-2 rounded-full transition-colors duration-300 ${activeTab === "team" ? "text-white" : "text-slate-400"}`}
          >
            <Users size={20} className="mb-1" />
            <span className="text-[9px] font-bold tracking-widest uppercase">
              Team
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("tasks");
              setSelectedEmployee(null);
            }}
            className={`flex-1 relative z-10 flex flex-col items-center justify-center py-2 rounded-full transition-colors duration-300 ${activeTab === "tasks" ? "text-white" : "text-slate-400"}`}
          >
            <Briefcase size={20} className="mb-1" />
            <span className="text-[9px] font-bold tracking-widest uppercase">
              Tasks
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("alerts");
              setSelectedEmployee(null);
            }}
            className={`flex-1 relative z-10 flex flex-col items-center justify-center py-2 rounded-full transition-colors duration-300 ${activeTab === "alerts" ? "text-white" : "text-slate-400"}`}
          >
            <div className="relative">
              <Bell size={20} className="mb-1" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            </div>
            <span className="text-[9px] font-bold tracking-widest uppercase">
              Alerts
            </span>
          </button>
        </nav>
      </div>

      {/* 🚀 TASK ASSIGNMENT MODAL */}
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Assign Task</h2>
                <p className="text-slate-400 text-sm">
                  Target: {selectedEmployee.name}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="rotate-90" />
              </button>
            </div>

            <form onSubmit={handleAssignTask} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Task Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Site Visit at Pithampur Sector 5"
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none transition-all font-medium"
                  onChange={(e) =>
                    setTaskData({ ...taskData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Instructions
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Provide details about the work..."
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none transition-all font-medium"
                  onChange={(e) =>
                    setTaskData({ ...taskData, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Priority Level
                </label>
                <div className="flex gap-3">
                  {["Low", "Medium", "High"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTaskData({ ...taskData, priority: p })}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${taskData.priority === p ? "bg-slate-900 text-white shadow-lg" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Assign Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MPIDCAdminDashboard;
