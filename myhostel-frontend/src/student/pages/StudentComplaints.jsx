import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  ShieldAlert, Send, History, Clock, 
  CheckCircle2, AlertCircle, Loader2, Sparkles 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  // 1. Fetch Student's Personal Complaints
  const fetchMyComplaints = async () => {
    try {
      const res = await API.get('/complaints/my-complaints');
      setComplaints(res.data);
    } catch (err) {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyComplaints(); }, []);

  // 2. Submit New Complaint (Title & Description only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post('/complaints/create', formData);
      toast.success("AI analyzed & filed your complaint!");
      setFormData({ title: '', description: '' });
      fetchMyComplaints(); // Refresh list to see new AI tags
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  // UI Helpers for Priority Colors
  const getPriorityColor = (p) => {
    const colors = {
      Urgent: "bg-red-50 text-red-600 border-red-100",
      High: "bg-orange-100 text-orange-700 border-orange-200",
      Medium: "bg-amber-50 text-amber-600 border-amber-100",
      Low: "bg-slate-50 text-slate-500 border-slate-100"
    };
    return colors[p] || colors.Low;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-[#fffcf9] min-h-screen">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2 text-orange-600">
          <Sparkles size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Powered Support</span>
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Complaint Center</h2>
        <p className="text-slate-500 font-medium">Just describe your issue; our AI will categorize it for the Warden.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: Simple Create Form */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-100 sticky top-8">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <ShieldAlert className="text-orange-500" size={22} /> Create New Complaint
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Short Title</label>
                <input 
                  required
                  placeholder="e.g. Fan not working"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-4 bg-orange-50/30 border border-orange-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Detailed Description</label>
                <textarea 
                  required
                  placeholder="Describe the problem..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-4 bg-orange-50/30 border border-orange-100 rounded-2xl text-sm font-medium min-h-[150px] outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <button 
                disabled={submitting}
                className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-100 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                Submit to AI
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Complaint History */}
        <div className="lg:col-span-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 min-h-[600px]">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="text-orange-500" size={22} /> Your Activity
              </div>
              <span className="text-xs bg-orange-50 px-3 py-1 rounded-full text-orange-600 font-bold">{complaints.length} Records</span>
            </h3>

            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-32 bg-orange-50/30 animate-pulse rounded-3xl" />)}
              </div>
            ) : complaints.length === 0 ? (
              <div className="text-center py-24">
                <AlertCircle className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold">No complaints filed yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map((item) => (
                  <div key={item._id} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl hover:border-orange-100 transition-all group">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-[10px] bg-slate-100 text-slate-500 font-black uppercase border border-slate-200">
                            {item.category}
                          </span>
                          <span className="text-[10px] font-bold text-slate-300 ml-auto uppercase tracking-tighter flex items-center gap-1">
                            <Clock size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-black text-slate-800 text-lg group-hover:text-orange-600 transition-colors">{item.title}</h4>
                        <p className="text-slate-500 text-sm mt-1 leading-relaxed">{item.description}</p>
                        
                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                             Staff: <span className="text-slate-600">{item.assignedStaff}</span>
                          </div>
                          <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${item.status === 'Resolved' ? 'text-green-500' : 'text-amber-500'}`}>
                            {item.status === 'Resolved' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                            {item.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentComplaints;