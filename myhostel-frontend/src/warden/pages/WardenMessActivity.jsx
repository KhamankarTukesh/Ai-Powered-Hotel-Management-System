import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { 
  Check, X, MessageSquare, Utensils, TrendingDown, Clock, User 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const WardenMessActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllActivities = async () => {
    try {
      const res = await API.get('/mess/all-activities');
      setActivities(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (activityId, newStatus) => {
    try {
      await API.patch('/mess/update-request', { activityId, status: newStatus });
      toast.success(`Request marked as ${newStatus}`);
      fetchAllActivities();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  useEffect(() => {
    fetchAllActivities();
    const interval = setInterval(fetchAllActivities, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Analytics Calculation
  const stats = {
    totalEaten: activities.reduce((acc, curr) => {
      const count = Object.values(curr.meals || {}).filter(m => m.checked).length;
      return acc + count;
    }, 0),
    pendingRequests: activities.filter(a => a.specialRequest?.status === 'Pending').length,
    negativeFeedback: activities.filter(a => a.feedback?.sentiment === 'Negative').length
  };

  if (loading) return (
    <div className="p-10 font-black animate-pulse text-center text-orange-500">LOADING WARDEN PANEL...</div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-[#fcfcfc] min-h-screen font-sans text-slate-900">

      {/* Header with Stats */}
      <header className="mb-12">
        <h1 className="text-5xl font-black italic tracking-tighter mb-8">
          Mess <span className="text-orange-500">Activity</span> Monitor
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><User size={24}/></div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Total Meals Served</p>
              <p className="text-2xl font-black">{stats.totalEaten}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-orange-100 p-4 rounded-2xl text-orange-600"><Clock size={24}/></div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Pending Special Requests</p>
              <p className="text-2xl font-black text-orange-600">{stats.pendingRequests}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-red-100 p-4 rounded-2xl text-red-600"><TrendingDown size={24}/></div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Critical Feedback</p>
              <p className="text-2xl font-black text-red-600">{stats.negativeFeedback}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Special Food Requests */}
        <section className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic flex items-center gap-2">
              <Utensils size={24} className="text-orange-500" /> Requests
            </h2>
            <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black">TODAY</span>
          </div>

          <div className="space-y-4">
            {activities.filter(a => a.specialRequest?.item).length > 0 ? (
              activities.filter(a => a.specialRequest?.item).map(act => {
                const isToday = act.date === new Date().toLocaleDateString('en-CA');
                return (
                  <div key={act._id} className="group bg-slate-50 hover:bg-white hover:shadow-md transition-all p-5 rounded-3xl border border-transparent hover:border-orange-200 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Room {act.student?.roomNumber || 'N/A'}</p>
                      <p className="font-bold text-lg">{act.student?.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-orange-500 w-2 h-2 rounded-full animate-pulse"></span>
                        <p className="text-orange-600 font-black text-sm uppercase">{act.specialRequest.item}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isToday && act.specialRequest.status === 'Pending' ? (
                        <>
                          <button onClick={() => handleUpdateStatus(act._id, 'Approved')} className="bg-green-500 text-white p-3 rounded-2xl hover:scale-110 transition-transform shadow-lg shadow-green-100">
                            <Check size={20}/>
                          </button>
                          <button onClick={() => handleUpdateStatus(act._id, 'Rejected')} className="bg-red-500 text-white p-3 rounded-2xl hover:scale-110 transition-transform shadow-lg shadow-red-100">
                            <X size={20}/>
                          </button>
                        </>
                      ) : (
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${act.specialRequest.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                          {act.specialRequest.status} {!isToday && "(EXPIRED)"}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-center text-slate-400 font-bold py-10">No special requests today.</p>
            )}
          </div>
        </section>

        {/* AI Feedback Wall */}
        <section className="bg-slate-900 rounded-[3rem] p-8 shadow-2xl text-white overflow-hidden relative">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-2xl font-black italic flex items-center gap-2">
              <MessageSquare size={24} className="text-blue-400" /> Student Feedback
            </h2>
          </div>

          <div className="space-y-6 relative z-10 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {activities.filter(a => a.feedback?.sentiment).length > 0 ? (
              activities.filter(a => a.feedback?.sentiment).map(fb => (
                <div key={fb._id} className="p-4 border-b border-slate-700">
                  <p className="font-bold">{fb.student?.name}</p>
                  <p className="text-sm">{fb.feedback.comment}</p>
                  <p className={`text-xs font-black mt-1 ${fb.feedback.sentiment === 'Negative' ? 'text-red-500' : 'text-green-400'}`}>
                    {fb.feedback.sentiment}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 font-bold py-10">No feedback received yet.</p>
            )}
          </div>
          {/* Background graphic */}
          <MessageSquare size={200} className="absolute -bottom-20 -right-20 text-slate-800 opacity-20 pointer-events-none" />
        </section>

      </div>
    </div>
  );
};

export default WardenMessActivity;
