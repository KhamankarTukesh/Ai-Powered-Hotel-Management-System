import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import {
  ShieldAlert,
  Send,
  History,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const fetchMyComplaints = async () => {
    try {
      const res = await API.get('/complaints/my-complaints');
      setComplaints(res.data);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyComplaints(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/complaints/create', formData);
      toast.success("Complaint submitted successfully!");
      setFormData({ title: '', description: '' });
      fetchMyComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (p) => {
    const colors = {
      Urgent: "bg-red-50 text-red-600 border-red-100",
      High: "bg-orange-50 text-orange-600 border-orange-100",
      Medium: "bg-amber-50 text-amber-600 border-amber-100",
      Low: "bg-slate-50 text-slate-500 border-slate-100"
    };
    return colors[p] || colors.Low;
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[#ff6a00] text-xs font-black uppercase tracking-widest mb-2">
            <Sparkles size={16} />
            Complaint Support
          </div>

          <h2 className="text-3xl font-black text-[#181411]">
            Complaint Center
          </h2>

          <p className="text-[#8c725f] text-sm mt-1">
            Submit your hostel issue and track progress.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT FORM */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 sticky top-6">

              <h3 className="text-[#181411] font-black text-lg mb-6 flex items-center gap-2">
                <ShieldAlert className="text-[#ff6a00]" size={20} />
                New Complaint
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Title */}
                <div>
                  <label className="text-[11px] font-black text-[#8c725f] uppercase tracking-widest block mb-2">
                    Title
                  </label>

                  <input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Fan not working"
                    className="w-full px-4 py-3 bg-[#f8f7f5] border border-slate-100 rounded-full outline-none text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[11px] font-black text-[#8c725f] uppercase tracking-widest block mb-2">
                    Description
                  </label>

                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe your issue..."
                    className="w-full p-4 bg-[#f8f7f5] border border-slate-100 rounded-[20px] outline-none text-sm min-h-[150px]"
                  />
                </div>

                <button
                  disabled={submitting}
                  className="w-full bg-[#ff6a00] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                  Submit Complaint
                </button>

              </form>
            </div>
          </div>

          {/* RIGHT HISTORY */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 min-h-[500px]">

              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[#181411] font-black text-lg flex items-center gap-2">
                  <History className="text-[#ff6a00]" size={20} />
                  Complaint History
                </h3>

                <span className="bg-[#f8f7f5] px-4 py-1 rounded-full text-xs font-bold text-[#8c725f]">
                  {complaints.length} Records
                </span>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-28 bg-[#f8f7f5] animate-pulse rounded-[20px]" />
                  ))}
                </div>
              ) : complaints.length === 0 ? (
                <div className="text-center py-20">
                  <AlertCircle className="mx-auto text-orange-200 mb-4" size={42} />
                  <p className="text-[#8c725f] font-medium">
                    No complaints submitted yet.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">

                  {complaints.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white border border-slate-100 rounded-[20px] p-5 hover:border-orange-100 transition-all"
                    >

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">

                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>

                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#f8f7f5] text-[#8c725f] border border-slate-100">
                          {item.category}
                        </span>

                        <span className="ml-auto text-[10px] text-[#c2b2a3] font-bold flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-[#181411] font-black text-base">
                        {item.title}
                      </h4>

                      <p className="text-[#8c725f] text-sm mt-1">
                        {item.description}
                      </p>

                      {/* Footer */}
                      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">

                        <span className="text-xs text-[#8c725f] font-bold">
                          Staff: {item.assignedStaff}
                        </span>

                        <span className={`flex items-center gap-1 text-[10px] font-black uppercase ${
                          item.status === 'Resolved'
                            ? 'text-green-500'
                            : 'text-amber-500'
                        }`}>
                          {item.status === 'Resolved'
                            ? <CheckCircle2 size={14} />
                            : <Clock size={14} />
                          }
                          {item.status}
                        </span>

                      </div>

                    </div>
                  ))}

                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentComplaints;
