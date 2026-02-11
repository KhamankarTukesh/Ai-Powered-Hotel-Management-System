import React, { useState } from 'react';
import API from '../../api/axios';
import {
  CheckCircle,
  Send,
  Star,
  Pizza,
  AlertCircle,
  Loader2,
  UtensilsCrossed
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentActions = () => {
  const [mealType, setMealType] = useState('breakfast');
  const [specialItem, setSpecialItem] = useState('');
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);

  const handleMarkMeal = async () => {
    setLoading(true);
    try {
      const res = await API.post('/mess/mark-meal', { mealType });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || "Already marked!");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    try {
      await API.post('/mess/feedback', feedback);
      toast.success("Feedback sent to Warden!");
      setFeedback({ rating: 5, comment: '' });
    } catch {
      toast.error("Failed to send feedback");
    }
  };

  const handleSpecialRequest = async () => {
    if (!specialItem) return toast.error("Mention an item name");

    try {
      await API.post('/mess/special-request', { item: specialItem });
      toast.success(`Request for ${specialItem} sent!`);
      setSpecialItem('');
    } catch {
      toast.error("Request failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] p-6 lg:p-10 font-sans">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">

          {/* Attendance Card */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
            <h3 className="text-[#181411] font-black text-lg mb-6 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              Mark Meal Presence
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {['breakfast', 'lunch', 'snacks', 'dinner'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMealType(type)}
                  className={`py-3 rounded-full text-sm font-bold capitalize transition-all shadow-sm ${
                    mealType === type
                      ? 'bg-[#181411] text-white'
                      : 'bg-[#f8f7f5] text-[#8c725f]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <button
              onClick={handleMarkMeal}
              disabled={loading}
              className="w-full bg-[#ff6a00] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <UtensilsCrossed size={18} />
              )}
              Confirm Meal
            </button>
          </div>

          {/* Special Request Card */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
            <h3 className="text-[#181411] font-black text-lg mb-2 flex items-center gap-2">
              <Pizza className="text-[#ff6a00]" size={20} />
              Special Food Request
            </h3>

            <p className="text-[#8c725f] text-sm mb-5">
              Feeling sick? Request Khichdi, Dahi etc.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter food item..."
                value={specialItem}
                onChange={(e) => setSpecialItem(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#f8f7f5] border border-slate-100 rounded-full outline-none text-sm"
              />

              <button
                onClick={handleSpecialRequest}
                className="bg-[#ff6a00] text-white px-6 rounded-full font-bold hover:bg-orange-600 transition-all"
              >
                Request
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Feedback */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
          <h3 className="text-[#181411] font-black text-lg mb-2 flex items-center gap-2">
            <Star className="text-yellow-500" size={20} />
            Share Experience
          </h3>

          <p className="text-[#8c725f] text-sm mb-8">
            Your feedback goes directly to the Warden.
          </p>

          <form onSubmit={handleFeedback} className="space-y-6">

            {/* Rating */}
            <div>
              <label className="text-[11px] font-black text-[#8c725f] uppercase tracking-widest block mb-3">
                Meal Rating
              </label>

              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() =>
                      setFeedback({ ...feedback, rating: num })
                    }
                    className={`size-11 rounded-full font-bold transition-all ${
                      feedback.rating >= num
                        ? 'bg-yellow-400 text-white'
                        : 'bg-[#f8f7f5] text-[#c2b2a3]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <textarea
                required
                value={feedback.comment}
                onChange={(e) =>
                  setFeedback({ ...feedback, comment: e.target.value })
                }
                placeholder="Write your food feedback..."
                className="w-full p-4 bg-[#f8f7f5] border border-slate-100 rounded-[20px] outline-none text-sm min-h-[140px]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#ff6a00] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all"
            >
              Submit Review <Send size={16} />
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-2">
            <AlertCircle size={16} className="text-blue-500 mt-1" />
            <p className="text-[11px] text-blue-600 font-medium">
              AI analyzes your feedback to improve mess quality.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentActions;
