import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, Users, Briefcase, CheckCircle, Clock, 
  Activity, Search, ChevronRight, Filter, MoreVertical, 
  ArrowUpRight, ShieldCheck, Bell, AlertTriangle, ArrowLeft, Send
} from 'lucide-react';

const MPIDCAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [taskFilter, setTaskFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Smart Employee View

  // 📈 Dummy Data for Admin
  const stats = { totalTasks: 142, completed: 89, inProgress: 35, pending: 18, activeOfficers: 12 };

  const teamMembers = [
    { id: 1, name: "John Doe", role: "Field Officer - Bhopal", status: "Active", color: "bg-blue-500", phone: "+91 9876543210" },
    { id: 2, name: "Rahul Sharma", role: "Auditor - Indore", status: "Busy", color: "bg-orange-500", phone: "+91 9876543211" },
    { id: 3, name: "Priya Singh", role: "Land Inspector - Gwalior", status: "Active", color: "bg-indigo-500", phone: "+91 9876543212" },
    { id: 4, name: "Amit Verma", role: "Compliance Head", status: "Offline", color: "bg-slate-400", phone: "+91 9876543213" },
  ];

  const globalTasks = [
    { id: 101, task: "Phase 3 Land Allotment", assignee: "Priya Singh", status: "Completed", date: "14 Apr '26", priority: "High" },
    { id: 102, task: "GST Audit Q1", assignee: "Rahul Sharma", status: "In Progress", date: "15 Apr '26", priority: "High" },
    { id: 103, task: "Pithampur Site Visit", assignee: "John Doe", status: "Pending", date: "16 Apr '26", priority: "Medium" },
    { id: 104, task: "Vendor Payment Clearance", assignee: "Rahul Sharma", status: "Overdue", date: "12 Apr '26", priority: "High" },
    { id: 105, task: "Env. Clearance Report", assignee: "John Doe", status: "Pending", date: "18 Apr '26", priority: "Low" },
  ];

  const systemAlerts = [
    { id: 1, type: "critical", text: "SYSTEM ALERT: Rahul Sharma missed the deadline for Vendor Payment Clearance.", time: "10 mins ago" },
    { id: 2, type: "info", text: "Priya Singh marked Phase 3 Land Allotment as Completed.", time: "1 hour ago" },
    { id: 3, type: "warning", text: "John Doe has 2 pending tasks approaching deadline.", time: "3 hours ago" },
    { id: 4, type: "info", text: "Rahul Sharma moved GST Audit Q1 to In Progress.", time: "5 hours ago" },
  ];

  // 🧠 Smart Calculations
  const filteredTasks = useMemo(() => {
    return globalTasks.filter(t => {
      const matchesStatus = taskFilter === 'All' || t.status === taskFilter;
      const matchesSearch = t.task.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.assignee.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [taskFilter, searchQuery]);

  const getEmployeeStats = (empName) => {
    const empTasks = globalTasks.filter(t => t.assignee === empName);
    return {
      total: empTasks.length,
      completed: empTasks.filter(t => t.status === 'Completed').length,
      inProgress: empTasks.filter(t => t.status === 'In Progress').length,
      pending: empTasks.filter(t => t.status === 'Pending' || t.status === 'Overdue').length,
      tasks: empTasks
    };
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setActiveTab('team'); // Stay on team tab but show details
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans selection:bg-emerald-200">
      
      {/* 🚀 ADMIN Desktop Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 text-white hidden md:flex flex-col p-8 sticky top-0 h-screen border-r border-slate-800 shadow-2xl z-20">
        <div className="mb-12 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 relative">
            <ShieldCheck size={24} className="text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-slate-900 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">MPIDC</h2>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em]">Admin Console</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-3">
          <button onClick={() => {setActiveTab('overview'); setSelectedEmployee(null);}} className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 font-medium ${activeTab === 'overview' ? 'bg-white/10 text-white shadow-inner backdrop-blur-md border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
            <LayoutDashboard size={22} className={activeTab === 'overview' ? 'text-emerald-400' : ''} /> 
            <span>Overview</span>
          </button>
          <button onClick={() => {setActiveTab('team'); setSelectedEmployee(null);}} className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 font-medium ${activeTab === 'team' ? 'bg-white/10 text-white shadow-inner backdrop-blur-md border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
            <Users size={22} className={activeTab === 'team' ? 'text-emerald-400' : ''} /> 
            <span>Team & Officers</span>
          </button>
          <button onClick={() => {setActiveTab('tasks'); setSelectedEmployee(null);}} className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 font-medium ${activeTab === 'tasks' ? 'bg-white/10 text-white shadow-inner backdrop-blur-md border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
            <Briefcase size={22} className={activeTab === 'tasks' ? 'text-emerald-400' : ''} /> 
            <span>Global Tasks</span>
          </button>
          <button onClick={() => {setActiveTab('alerts'); setSelectedEmployee(null);}} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 font-medium ${activeTab === 'alerts' ? 'bg-white/10 text-white shadow-inner backdrop-blur-md border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
            <div className="flex items-center space-x-4">
              <Bell size={22} className={activeTab === 'alerts' ? 'text-emerald-400' : ''} /> 
              <span>Activity & Alerts</span>
            </div>
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">1 New</span>
          </button>
        </nav>
        
        <div className="mt-auto pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 p-2 -ml-2 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center font-bold text-sm text-white">AM</div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">Ashish Mehra</p>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 🚀 Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* ✨ Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">Admin</h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border-2 border-emerald-500 flex items-center justify-center font-bold text-sm text-slate-700 relative">
            AM
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></div>
          </div>
        </header>

        {/* 🚀 Main Scrolling Area */}
        <main className="flex-1 pb-28 md:pb-12 overflow-y-auto pt-6 md:pt-10">
          <div className="p-5 md:px-12 max-w-6xl mx-auto">
            
            {/* 📊 OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="animate-in fade-in duration-500">
                <header className="mb-8">
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Department Overview</h1>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-8">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div className="bg-blue-50 w-10 h-10 flex items-center justify-center rounded-xl text-blue-600 mb-4"><Briefcase size={20}/></div>
                    <div><h3 className="text-3xl font-bold text-slate-900">{stats.totalTasks}</h3><p className="text-slate-500 text-sm font-medium">Total Tasks</p></div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div className="bg-emerald-50 w-10 h-10 flex items-center justify-center rounded-xl text-emerald-600 mb-4"><CheckCircle size={20}/></div>
                    <div><h3 className="text-3xl font-bold text-slate-900">{stats.completed}</h3><p className="text-slate-500 text-sm font-medium">Completed</p></div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div className="bg-red-50 w-10 h-10 flex items-center justify-center rounded-xl text-red-600 mb-4"><AlertTriangle size={20}/></div>
                    <div><h3 className="text-3xl font-bold text-slate-900 text-red-600">3</h3><p className="text-slate-500 text-sm font-medium">Overdue / Critical</p></div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div className="bg-purple-50 w-10 h-10 flex items-center justify-center rounded-xl text-purple-600 mb-4"><Users size={20}/></div>
                    <div><h3 className="text-3xl font-bold text-slate-900">{stats.activeOfficers}</h3><p className="text-slate-500 text-sm font-medium">Active Officers</p></div>
                  </div>
                </div>
                
                {/* Send Broadcast Feature */}
                <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
                   <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full"></div>
                   <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Send size={20} className="text-emerald-400"/> Broadcast Message</h3>
                   <p className="text-slate-400 text-sm mb-5">Send instructions or notices to all field officers instantly.</p>
                   <div className="flex flex-col md:flex-row gap-3 relative z-10">
                     <input type="text" placeholder="Type your announcement here..." className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-emerald-500 focus:outline-none text-white placeholder:text-slate-500" />
                     <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/30">Send to All</button>
                   </div>
                </div>
              </div>
            )}

            {/* 👥 TEAM DIRECTORY (List OR Smart Profile) */}
            {activeTab === 'team' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                
                {/* IF EMPLOYEE IS SELECTED: Show Smart Profile */}
                {selectedEmployee ? (
                  <div>
                    <button onClick={() => setSelectedEmployee(null)} className="flex items-center text-slate-500 hover:text-emerald-600 font-semibold text-sm mb-6 transition-colors">
                      <ArrowLeft size={16} className="mr-2"/> Back to Directory
                    </button>
                    
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 mb-8 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className={`w-20 h-20 rounded-2xl ${selectedEmployee.color} text-white flex items-center justify-center font-bold text-3xl shadow-lg`}>
                            {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h1 className="text-3xl font-black text-slate-900">{selectedEmployee.name}</h1>
                            <p className="text-slate-500 font-medium mb-2">{selectedEmployee.role}</p>
                            <span className={`px-3 py-1 rounded-full border text-xs font-bold ${selectedEmployee.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : selectedEmployee.status === 'Busy' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                              Status: {selectedEmployee.status}
                            </span>
                          </div>
                        </div>
                        <div className="w-full md:w-auto space-y-3">
                          <button className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
                            <Send size={16}/> Direct Message
                          </button>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-5">Performance Snapshot</h3>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {['completed', 'inProgress', 'pending'].map(stat => (
                        <div key={stat} className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
                          <h3 className="text-3xl font-black text-slate-800">{getEmployeeStats(selectedEmployee.name)[stat]}</h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.replace(/([A-Z])/g, ' $1').trim()}</p>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-5">Current Tasks assigned to {selectedEmployee.name.split(' ')[0]}</h3>
                    <div className="space-y-3">
                      {getEmployeeStats(selectedEmployee.name).tasks.length > 0 ? getEmployeeStats(selectedEmployee.name).tasks.map(t => (
                        <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-slate-800">{t.task}</h4>
                            <p className="text-xs text-slate-500 mt-1 flex items-center"><Clock size={12} className="mr-1"/> Due: {t.date}</p>
                          </div>
                          <span className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${t.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : t.status === 'Overdue' ? 'bg-red-50 text-red-600 border-red-100' : t.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            {t.status}
                          </span>
                        </div>
                      )) : (
                        <p className="text-slate-500 bg-white p-8 rounded-2xl border border-slate-200 text-center font-medium">No tasks assigned currently.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  // IF NO EMPLOYEE SELECTED: Show Grid
                  <div>
                    <header className="mb-8">
                      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Team Directory</h1>
                      <p className="text-slate-500 mt-1">Select an officer to view their specific dashboard and progress.</p>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {teamMembers.map((member) => (
                        <div key={member.id} onClick={() => handleEmployeeClick(member)} className="cursor-pointer group bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-full ${member.color} text-white flex items-center justify-center font-bold text-lg shadow-sm`}>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className={`w-2.5 h-2.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-500' : member.status === 'Busy' ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{member.name}</h3>
                          <p className="text-sm font-medium text-slate-500 mb-5">{member.role}</p>
                          
                          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                            <div>
                              <p className="text-xs text-slate-400 font-semibold uppercase">Assigned</p>
                              <p className="text-lg font-bold text-slate-800">{getEmployeeStats(member.name).total} Tasks</p>
                            </div>
                            <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all"/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 📋 GLOBAL TASKS TAB */}
            {activeTab === 'tasks' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <header className="mb-8">
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Global Tracking</h1>
                  <p className="text-slate-500 mt-1">All departmental tasks.</p>
                </header>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="divide-y divide-slate-100">
                    {globalTasks.map((t) => (
                      <div key={t.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-4">
                           <div className={`mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full ${t.priority === 'High' ? 'bg-red-500' : t.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                           <div>
                             <h4 className="font-bold text-slate-800">{t.task}</h4>
                             <p className="text-xs font-medium text-slate-500 mt-1 block">Assigned to: <span className="font-bold text-slate-700">{t.assignee}</span> • Due: {t.date}</p>
                           </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-lg border text-xs font-bold text-center md:text-right ${t.status === 'Completed' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : t.status === 'Overdue' ? 'text-red-600 bg-red-50 border-red-100 animate-pulse' : t.status === 'Pending' ? 'text-orange-600 bg-orange-50 border-orange-100' : 'text-blue-600 bg-blue-50 border-blue-100'}`}>
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 🔔 ACTIVITY & NOTIFICATIONS TAB (New Smart Feature) */}
            {activeTab === 'alerts' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <header className="mb-8 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Activity Log</h1>
                    <p className="text-slate-500 mt-1">Live updates and system alerts for all officers.</p>
                  </div>
                </header>

                <div className="space-y-4">
                  {systemAlerts.map(alert => (
                    <div key={alert.id} className={`p-5 rounded-2xl border flex gap-4 items-start ${alert.type === 'critical' ? 'bg-red-50 border-red-200' : alert.type === 'warning' ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'}`}>
                      <div className={`p-2 rounded-xl flex-shrink-0 ${alert.type === 'critical' ? 'bg-red-100 text-red-600' : alert.type === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                        {alert.type === 'critical' ? <AlertTriangle size={20}/> : alert.type === 'warning' ? <Clock size={20}/> : <Activity size={20}/>}
                      </div>
                      <div>
                        <p className={`font-bold text-sm md:text-base ${alert.type === 'critical' ? 'text-red-900' : 'text-slate-800'}`}>{alert.text}</p>
                        <p className="text-xs font-semibold text-slate-400 mt-1">{alert.time}</p>
                      </div>
                      {alert.type === 'critical' && (
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
            <div className={`w-1/4 bg-emerald-500 rounded-full transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
              activeTab === 'overview' ? 'translate-x-0' : 
              activeTab === 'team' ? 'translate-x-full' : 
              activeTab === 'tasks' ? 'translate-x-[200%]' :
              'translate-x-[300%]'
            }`}></div>
          </div>

          <button onClick={() => {setActiveTab('overview'); setSelectedEmployee(null);}} className={`flex-1 relative z-10 flex flex-col items-center justify-center py-2 rounded-full transition-colors duration-300 ${activeTab === 'overview' ? 'text-white' : 'text-slate-400'}`}>
            <LayoutDashboard size={20} className="mb-1" /> 
            <span className="text-[9px] font-bold tracking-widest uppercase">Overvw</span>
          </button>
          
          <button onClick={() => setActiveTab('team')} className={`flex-1 relative z-10 flex flex-col items-center justify-center py-2 rounded-full transition-colors duration-300 ${activeTab === 'team' ? 'text-white' : 'text-slate-400'}`}>
            <Users size={20} className="mb-1" /> 
            <span className="text-[9px] font-bold tracking-widest uppercase">Team</span>
          </button>

          <button onClick={() => {setActiveTab('tasks'); setSelectedEmployee(null);}} className={`flex-1 relative z-10 flex flex-col items-center justify-center py-2 rounded-full transition-colors duration-300 ${activeTab === 'tasks' ? 'text-white' : 'text-slate-400'}`}>
            <Briefcase size={20} className="mb-1" /> 
            <span className="text-[9px] font-bold tracking-widest uppercase">Tasks</span>
          </button>

          <button onClick={() => {setActiveTab('alerts'); setSelectedEmployee(null);}} className={`flex-1 relative z-10 flex flex-col items-center justify-center py-2 rounded-full transition-colors duration-300 ${activeTab === 'alerts' ? 'text-white' : 'text-slate-400'}`}>
            <div className="relative">
              <Bell size={20} className="mb-1" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            </div>
            <span className="text-[9px] font-bold tracking-widest uppercase">Alerts</span>
          </button>
        </nav>
      </div>

    </div>
  );
};

export default MPIDCAdminDashboard;