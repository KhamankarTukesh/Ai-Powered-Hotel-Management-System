import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  PlaneTakeoff, Calendar, History, ClipboardList, 
  Clock, CheckCircle, XCircle, Send, Loader2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    reason: '',
    startDate: '',
    endDate: ''
  });

  const fetchLeaves = async () => {
    try {
      const res = await API.get('/leaves/my-leaves');
      setLeaves(res.data);
    } catch {
      toast.error("Failed to load leave history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await API.post('/leaves/apply', formData);
      toast.success(res.data.message);
      setFormData({ reason: '', startDate: '', endDate: '' });
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error applying leave");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-orange-100 text-orange-700 border-orange-200",
      Approved: "bg-green-100 text-green-700 border-green-200",
      Rejected: "bg-red-100 text-red-700 border-red-200"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${styles[status] || styles.Pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 bg-[#fffcf9] min-h-screen">

      {/* Header */}
      <header className="mb-8 md:mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-1 w-10 bg-orange-500 rounded-full"></div>
          <span className="text-orange-500 font-black text-[10px] sm:text-xs uppercase tracking-widest">
            Student Leave Panel
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-3">
          <PlaneTakeoff className="text-orange-500" size={34} />
          Apply for Leave
        </h2>

        <p className="text-sm md:text-base text-slate-500 font-medium mt-1 italic">
          Plan your trips and track approval status in real-time.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

        {/* LEFT FORM */}
        <div className="lg:col-span-4">

          <div className="bg-white p-5 sm:p-7 md:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-orange-100 lg:sticky lg:top-8">

            <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-5 flex items-center gap-2">
              <ClipboardList className="text-orange-500" size={20} />
              Request Form
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Reason */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Reason for Leave
                </label>

                <textarea
                  required
                  value={formData.reason}
                  placeholder="e.g. Visiting home..."
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full p-3 sm:p-4 bg-orange-50/30 border border-orange-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 min-h-[110px] text-sm font-medium transition-all"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">
                    Start Date
                  </label>

                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-3 sm:p-4 bg-orange-50/30 border border-orange-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">
                    End Date
                  </label>

                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-3 sm:p-4 bg-orange-50/30 border border-orange-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

              </div>

              {/* Submit */}
              <button
                disabled={submitting}
                className="w-full bg-orange-500 text-white py-3 sm:py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-100"
              >
                {submitting
                  ? <Loader2 className="animate-spin" />
                  : <Send size={18} />}
                Send to Warden
              </button>

            </form>
          </div>
        </div>

        {/* RIGHT HISTORY */}
        <div className="lg:col-span-8">

          <div className="bg-white p-5 sm:p-7 md:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[500px]">

            <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <History className="text-orange-500" size={20} />
                Leave History
              </div>

              <span className="text-xs bg-orange-50 px-3 py-1 rounded-full text-orange-600 font-bold w-fit">
                {leaves.length} Applications
              </span>
            </h3>

            {/* Loading */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i =>
                  <div key={i} className="h-24 bg-orange-50/50 animate-pulse rounded-3xl" />
                )}
              </div>
            ) : leaves.length === 0 ? (

              <div className="text-center py-16">
                <Calendar className="mx-auto text-orange-200" size={40} />
                <p className="text-slate-400 font-bold mt-4">
                  No leave applications yet.
                </p>
              </div>

            ) : (

              <div className="space-y-4">

                {leaves.map((leave) => (

                  <div key={leave._id}
                    className="p-4 sm:p-6 bg-white border border-slate-100 rounded-2xl sm:rounded-[2rem] hover:shadow-lg transition-all group relative overflow-hidden">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {getStatusBadge(leave.status)}

                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(leave.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-800 text-base sm:text-lg mb-2">
                          {leave.reason}
                        </h4>

                        <div className="flex items-center gap-2 bg-orange-50/50 px-3 py-1.5 rounded-xl border border-orange-100 w-fit">
                          <Calendar size={14} className="text-orange-500" />
                          <span className="text-xs font-black text-slate-700">
                            {new Date(leave.startDate).toLocaleDateString('en-GB')}
                            {" - "}
                            {new Date(leave.endDate).toLocaleDateString('en-GB')}
                          </span>
                        </div>

                      </div>

                      <div className="flex items-center justify-center size-10 sm:size-12 rounded-2xl bg-slate-50">
                        {leave.status === 'Approved'
                          ? <CheckCircle className="text-green-500" />
                          : leave.status === 'Rejected'
                            ? <XCircle className="text-red-500" />
                            : <Clock className="text-orange-400 animate-pulse" />}
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

export default LeaveManagement;
