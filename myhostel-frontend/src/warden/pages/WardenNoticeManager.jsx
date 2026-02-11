import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import {
  Megaphone,
  Trash2,
  AlertTriangle,
  FileText,
  Paperclip,
  Loader2,
  Calendar,
  User,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const WardenNoticeManager = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    isEmergency: false
  });
  const [file, setFile] = useState(null);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/notice/all');
      setNotices(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handlePostNotice = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      if (formData.isEmergency) {
        await API.post('/notice/emergency', {
          title: formData.title,
          message: formData.content
        });
        toast.success("Emergency Alert Broadcasted! 📣");
      } else {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);
        data.append("category", formData.category);
        data.append("isEmergency", false);
        if (file) data.append("attachment", file);

        await API.post('/notice/create', data);
        toast.success("Notice posted successfully!");
      }

      setFormData({ title: '', content: '', category: 'General', isEmergency: false });
      setFile(null);
      fetchNotices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      await API.delete(`/notice/delete/${id}`);
      toast.success("Notice removed");
      setNotices(notices.filter(n => n._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] p-4 sm:p-6 md:p-12 font-display">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">

        {/* Left: Create Notice Form */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Broadcast</h1>
            <p className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px]">Announce to all students</p>
          </div>

          <form onSubmit={handlePostNotice} className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-orange-50 space-y-4 md:space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Notice Title</label>
              <input
                required
                className="w-full p-3 md:p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-orange-200 text-sm md:text-base"
                placeholder="Ex: Holiday Announcement"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Category</label>
                <div className="relative flex items-center">
                  <select
                    className="w-full p-3 md:p-4 bg-slate-50 rounded-2xl font-bold outline-none text-sm md:text-base appearance-none cursor-pointer pr-10"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="General">General</option>
                    <option value="Event">Event</option>
                    <option value="Fee">Fee</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                  <div className="absolute right-4 pointer-events-none text-slate-400">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Attachment</label>
                <label className="flex items-center justify-center p-3 md:p-4 bg-orange-50 text-orange-600 rounded-2xl cursor-pointer hover:bg-orange-100 transition-all border-2 border-dashed border-orange-200">
                  <Paperclip size={18} />
                  <span className="ml-2 text-xs font-black truncate">{file ? "Added" : "UPLOAD PDF"}</span>
                  <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 md:p-4 bg-red-50 rounded-2xl border border-red-100">
              <input
                type="checkbox"
                id="emergency"
                className="w-5 h-5 accent-red-600 cursor-pointer shrink-0"
                checked={formData.isEmergency}
                onChange={(e) => setFormData({ ...formData, isEmergency: e.target.checked })}
              />
              <label htmlFor="emergency" className="text-[10px] md:text-xs font-black text-red-600 uppercase cursor-pointer flex items-center gap-2">
                <AlertTriangle size={14} /> Mark as Emergency Alert
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Content</label>
              <textarea
                required
                className="w-full p-3 md:p-4 bg-slate-50 rounded-2xl font-bold outline-none h-28 md:h-32 resize-none text-sm md:text-base"
                placeholder="Write notice details here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={btnLoading}
              className="w-full hover:scale-105 text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 bg-orange-500 transition-all shadow-lg active:scale-95"
            >
              {btnLoading ? <Loader2 className="animate-spin" size={18} /> : <Megaphone size={18} />}
              Post Notice
            </button>
          </form>
        </div>

        {/* Right: Notices List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2 mt-4 lg:mt-0">
            <h2 className="text-lg md:text-xl font-black text-slate-900 italic uppercase tracking-tight">Active Notices</h2>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black">{notices.length} Total</span>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[60vh] lg:max-h-[70vh] pr-1 md:pr-2 no-scrollbar">
            {loading ? (
              <div className="flex justify-center p-10 md:p-20"><Loader2 className="animate-spin text-orange-500" /></div>
            ) : notices.map((notice) => (
              <div
                key={notice._id}
                className={`bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border min-h-[160px] md:min-h-[180px] flex flex-col ${notice.isEmergency ? 'border-red-100 bg-red-50/30' : 'border-slate-100'} shadow-sm relative transition-all hover:shadow-md`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                    <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl shrink-0 ${notice.isEmergency ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {notice.isEmergency ? <AlertTriangle size={18} /> : <FileText size={18} />}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className={`font-black tracking-tight truncate text-sm md:text-base ${notice.isEmergency ? 'text-red-600' : 'text-slate-800'}`}>
                        {notice.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                        <User size={10} /> <span>{notice.postedBy?.fullName || "Warden"}</span>
                        <Calendar size={10} className="ml-1" /> <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(notice._id)} className="p-2 shrink-0 text-slate-300 hover:text-red-500 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="pl-12 md:pl-14 flex-grow overflow-hidden mt-1">
                  <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed h-[60px] md:h-[80px] overflow-y-auto no-scrollbar break-all md:break-words">
                    {notice.content}
                  </p>
                </div>

                {notice.attachmentUrl && (
                  <div className="pl-12 md:pl-14 mt-2">
                    <a
                      href={notice.attachmentUrl.replace("/upload/", "/upload/f_auto,q_auto/")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] md:text-[10px] font-black text-orange-600 uppercase underline flex items-center gap-1"
                    >
                      <Paperclip size={12} /> View Attachment
                    </a>
                  </div>
                )}
              </div>
            ))}
            {notices.length === 0 && !loading && (
              <div className="text-center py-20 text-slate-400 font-bold uppercase text-xs tracking-widest">No active notices</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardenNoticeManager;
