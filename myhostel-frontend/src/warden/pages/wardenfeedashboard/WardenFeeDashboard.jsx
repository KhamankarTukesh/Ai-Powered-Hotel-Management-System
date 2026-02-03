import React from "react";
import { useNavigate } from "react-router-dom";

const WardenFeeDashboard = () => {
  const navigate = useNavigate();

  // Define your paths here
  const actions = [
    {
      title: "Pending Verifications",
      desc: "Review and approve student payment proof submissions.",
      icon: "verified_user",
      badge: "Needs Action",
      path: "/warden/verify",
      showPriority: true,
    },
    {
      title: "Fee Analytics & Rebates",
      desc: "View student balances and apply mess rebates.",
      icon: "analytics",
      badge: "Manage Records",
      path: "/warden/management",
    },
    {
      title: "Create Fee Record",
      desc: "Link new fee structures to students without records.",
      icon: "playlist_add",
      badge: "New Cycle",
      path: "/warden/fees",
    },
    {
      title: "Financial Reports",
      desc: "Download full CSV reports and balance sheets.",
      icon: "description",
      badge: "Export Data",
      path: "/warden/actions", // This triggers your CSV download logic
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#fffaf5] font-display overflow-x-hidden selection:bg-orange-100 selection:text-orange-600">
      <div className="layout-container flex h-full grow flex-col items-center justify-center py-12 px-4 md:px-10">
        <div className="layout-content-container flex flex-col w-full max-w-[1024px] gap-8">
          
          {/* HEADER SECTION */}
          <div className="w-full bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-950 rounded-[2rem] p-8 md:p-10 shadow-lg border border-orange-100/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/40 to-transparent pointer-events-none"></div>
            <div className="flex flex-col gap-2 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <span className="material-symbols-outlined text-orange-600">security</span>
                </div>
                <p className="text-orange-600/80 text-sm font-semibold tracking-wide uppercase">Hostel Management System</p>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mt-1 italic">Warden Finance Hub</h1>
            </div>
            <div className="flex items-center gap-3 bg-white/60 px-5 py-3 rounded-full backdrop-blur-md border border-orange-100 shadow-sm z-10">
              <span className="material-symbols-outlined text-orange-500" style={{ fontSize: '20px' }}>calendar_today</span>
              <span className="text-gray-700 text-sm font-semibold">
  Academic Session {new Date().getFullYear() - 1}-{new Date().getFullYear()}
</span>
            </div>
          </div>

          {/* GRID SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {actions.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className="group relative flex flex-col justify-between p-8 min-h-[300px] bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm hover:shadow-2xl hover:shadow-orange-200/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Decorative Blur Circle */}
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-orange-50 rounded-full blur-3xl group-hover:bg-orange-100 transition-colors"></div>

                <div className="flex justify-between items-start z-10">
                  <div className="h-14 w-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>{item.icon}</span>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1 transition-all ${
                    item.showPriority 
                    ? "bg-orange-100 text-orange-700 border-orange-200 group-hover:bg-orange-600 group-hover:text-white" 
                    : "bg-white text-gray-500 border-gray-100 group-hover:border-orange-200"
                  }`}>
                    {item.showPriority && <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>priority_high</span>}
                    {item.badge}
                  </span>
                </div>

                <div className="flex flex-col gap-3 mt-auto z-10">
                  <h2 className="text-gray-900 text-2xl font-black leading-tight group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-gray-500 text-base font-medium leading-relaxed group-hover:text-gray-700">
                    {item.desc}
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className="absolute bottom-8 right-8 h-10 w-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardenFeeDashboard;