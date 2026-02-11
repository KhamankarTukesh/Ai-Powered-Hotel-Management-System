import React from "react";
import { useNavigate } from "react-router-dom";

const WardenFeeDashboard = () => {
  const navigate = useNavigate();

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
      path: "/warden/actions",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#fffaf5] font-display overflow-x-hidden px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* ================= HEADER ================= */}
        <div className="relative w-full bg-gradient-to-r from-orange-50 to-orange-100/60 text-orange-950 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md border border-orange-100 flex flex-col lg:flex-row justify-between gap-6 overflow-hidden">

          <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/40 to-transparent pointer-events-none" />

          {/* Left Section */}
          <div className="flex flex-col gap-2 z-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <span className="material-symbols-outlined text-orange-600">
                  security
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-orange-600/80">
                Hostel Management System
              </p>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold italic text-gray-900">
              Warden Finance Hub
            </h1>
          </div>

          {/* Session Badge */}
          <div className="flex items-center justify-center lg:justify-end z-10">
            <div className="flex items-center gap-2 sm:gap-3 bg-white/70 px-4 sm:px-5 py-2 sm:py-3 rounded-full backdrop-blur-md border border-orange-100 shadow-sm">
              <span className="material-symbols-outlined text-orange-500 text-[18px]">
                calendar_today
              </span>

              <span className="text-gray-700 text-xs sm:text-sm font-semibold">
                Academic Session {new Date().getFullYear() - 1}-
                {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5 sm:gap-6">

          {actions.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="group relative flex flex-col justify-between p-6 sm:p-8 min-h-[240px] sm:min-h-[280px] lg:min-h-[300px] bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-sm transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 overflow-hidden"
            >

              {/* Blur Decoration */}
              <div className="absolute -right-10 -top-10 w-40 sm:w-48 h-40 sm:h-48 bg-orange-50 rounded-full blur-3xl group-hover:bg-orange-100 transition-colors" />

              {/* Top Row */}
              <div className="flex justify-between items-start z-10">

                {/* Icon */}
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 transition-all group-hover:bg-orange-600 group-hover:text-white">
                  <span className="material-symbols-outlined text-[22px] sm:text-[28px]">
                    {item.icon}
                  </span>
                </div>

                {/* Badge */}
                <span
                  className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border flex items-center gap-1 transition-all
                  ${
                    item.showPriority
                      ? "bg-orange-100 text-orange-700 border-orange-200 group-hover:bg-orange-600 group-hover:text-white"
                      : "bg-white text-gray-500 border-gray-100 group-hover:border-orange-200"
                  }`}
                >
                  {item.showPriority && (
                    <span className="material-symbols-outlined text-[12px]">
                      priority_high
                    </span>
                  )}
                  {item.badge}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2 sm:gap-3 mt-auto z-10">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h2>

                <p className="text-sm sm:text-base text-gray-500 font-medium group-hover:text-gray-700">
                  {item.desc}
                </p>
              </div>

              {/* Arrow */}
              <div className="absolute bottom-6 right-6 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WardenFeeDashboard;
