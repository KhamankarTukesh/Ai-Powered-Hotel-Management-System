import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { formatDistanceToNow } from "date-fns";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await API.get("/notice/all");
        setNotices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const filteredNotices =
    filter === "All"
      ? notices
      : notices.filter(
          (n) => n.category === filter || (filter === "Urgent" && n.isEmergency)
        );

  /* ---------------- LOADING SCREEN ---------------- */

  if (loading)
    return (
      <div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center">
        <div className="text-[#ff6a00] font-semibold animate-pulse text-lg">
          Loading Hostel Notices...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FFF7ED] p-6 lg:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* ---------- Page Title ---------- */}
        <h1 className="text-3xl font-black text-[#181411] mb-8 tracking-tight">
          Hostel Notices
        </h1>

        {/* ---------- FILTER PILLS ---------- */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {["All", "Urgent", "Event", "General", "Fee"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${
                filter === cat
                  ? "bg-[#181411] text-white scale-105"
                  : "bg-white text-[#8c725f] hover:shadow-md"
              }`}
            >
              {cat === "All" ? "All Notices" : cat}
            </button>
          ))}
        </div>

        {/* ---------- NOTICES LIST ---------- */}
        <div className="flex flex-col gap-6">
          {filteredNotices.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-orange-100">
              <span className="material-symbols-outlined text-5xl text-orange-200 mb-4">
                notifications_off
              </span>
              <p className="text-[#8c725f] font-medium">
                No {filter} notices found.
              </p>
            </div>
          ) : (
            filteredNotices.map((notice) => (
              <div
                key={notice._id}
                className={`bg-white rounded-3xl p-6 shadow-sm border transition hover:shadow-md ${
                  notice.isEmergency
                    ? "border-red-200 bg-red-50/20 ring-1 ring-red-100"
                    : "border-slate-100"
                }`}
              >
                {/* ---------- HEADER ---------- */}
                <div className="flex justify-between mb-4">
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="size-10 rounded-full bg-orange-100 flex items-center justify-center text-[#ff6a00] font-bold">
                      {notice.postedBy?.fullName?.charAt(0) || "W"}
                    </div>

                    {/* Name + Time */}
                    <div>
                      <p className="font-bold text-sm text-[#181411]">
                        {notice.postedBy?.fullName || "Hostel Warden"}
                      </p>

                      <p className="text-[11px] text-[#8c725f] mt-1">
                        {formatDistanceToNow(
                          new Date(notice.createdAt)
                        )}{" "}
                        ago • {notice.category}
                      </p>
                    </div>
                  </div>

                  {/* Urgent Badge */}
                  {notice.isEmergency && (
                    <div className="flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      <span className="material-symbols-outlined text-[14px]">
                        campaign
                      </span>
                      Urgent
                    </div>
                  )}
                </div>

                {/* ---------- TITLE ---------- */}
                <h2 className="text-lg font-black text-[#181411] mb-2">
                  {notice.title}
                </h2>

                {/* ---------- CONTENT ---------- */}
                <p className="text-sm text-[#8c725f] leading-relaxed mb-4">
                  {notice.content}
                </p>

                {/* ---------- ATTACHMENT ---------- */}
                {notice.attachmentUrl && (
                  <div className="flex justify-between items-center bg-[#f8f7f5] p-3 rounded-xl border">
                    <div className="flex gap-3 text-xs font-bold text-[#181411]">
                      <span className="material-symbols-outlined text-red-500">
                        description
                      </span>
                      Official_Document.pdf
                    </div>

                    <a
                      href={notice.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#ff6a00] text-white text-[11px] font-bold px-5 py-2 rounded-full hover:bg-orange-600 transition"
                    >
                      View
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notices;
