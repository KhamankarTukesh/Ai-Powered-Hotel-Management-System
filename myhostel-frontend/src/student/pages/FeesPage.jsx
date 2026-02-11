import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Download, CreditCard, Loader2 } from 'lucide-react';

const FeesPage = () => {
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'UPI',
    externalTransactionId: ''
  });

  const fetchFees = async () => {
    try {
      const res = await API.get('/fee/my-fees');
      setFeeData(res.data);
    } catch (err) {
      toast.error("Failed to load fee data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFees(); }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    const payToast = toast.loading("Processing payment details...");

    try {
      const res = await API.post('/fee/pay', formData);
      toast.success(res.data.message || "Details submitted!", { id: payToast });

      setFormData({
        amount: '',
        paymentMethod: 'UPI',
        externalTransactionId: ''
      });

      fetchFees();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment Failed", { id: payToast });
    }
  };

  const handleDownload = async () => {
    try {
      const response = await API.get('/fee/receipt/latest', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Receipt_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();

      toast.success("Receipt downloaded!");
    } catch {
      toast.error("Receipt not available yet.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-orange-50">
        <Loader2 className="animate-spin text-orange-600" size={40} />
      </div>
    );
  }

  const dues = (feeData?.totalAmount || 0) - (feeData?.paidAmount || 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700 px-4 sm:px-6 md:px-8 py-6">

      {/* Header */}
      <header>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-[1000] text-slate-800 tracking-tight uppercase">
          Fees Portal
        </h1>

        <p className="text-orange-600 font-bold text-[10px] sm:text-xs tracking-[0.2em]">
          DNYANDA HOSTEL MANAGEMENT
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard label="Total Fees" value={feeData?.totalAmount} color="border-orange-200" />
        <StatCard label="Paid Amount" value={feeData?.paidAmount} color="border-green-200" textColor="text-green-600" />
        <StatCard label="Remaining Dues" value={dues} color="border-red-200" textColor="text-red-600" />
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

        {/* Payment Form */}
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-orange-100 shadow-xl shadow-orange-500/5">

          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <div className="p-2.5 sm:p-3 bg-orange-100 rounded-2xl text-orange-600">
              <CreditCard size={22} />
            </div>

            <h2 className="text-lg sm:text-xl font-black text-slate-800">
              Submit Payment
            </h2>
          </div>

          <form onSubmit={handlePayment} className="space-y-4 sm:space-y-5">

            {/* Amount */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase ml-1">
                Amount to Pay
              </label>

              <input
                type="number"
                required
                value={formData.amount}
                className="w-full p-3 sm:p-4 text-sm sm:text-base rounded-2xl bg-orange-50/50 border border-orange-100 focus:border-orange-500 outline-none transition-all font-bold"
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>

            {/* Transaction */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase ml-1">
                Transaction ID (UTR)
              </label>

              <input
                type="text"
                required
                value={formData.externalTransactionId}
                placeholder="Ex: 4123XXXXXXXX"
                className="w-full p-3 sm:p-4 text-sm sm:text-base rounded-2xl bg-orange-50/50 border border-orange-100 focus:border-orange-500 outline-none transition-all font-bold"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    externalTransactionId: e.target.value
                  })
                }
              />
            </div>

            {/* Button */}
            <button className="w-full bg-[#f97415] text-white py-3 sm:py-4 rounded-2xl text-sm sm:text-base font-black shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all">
              SUBMIT FOR VERIFICATION
            </button>

          </form>
        </div>

        {/* Receipt Section */}
        <div className="bg-slate-900 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center space-y-5 sm:space-y-6">

          <div className="size-16 sm:size-20 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
            <Download size={28} className="text-orange-400" />
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-black">
              Latest Receipt
            </h3>

            <p className="text-slate-400 text-xs sm:text-sm mt-2 px-3">
              Download your official payment confirmation PDF.
            </p>
          </div>

          <button
            onClick={handleDownload}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-orange-600 rounded-2xl font-black text-sm sm:text-base hover:bg-orange-500 transition-all flex items-center gap-2"
          >
            <Download size={18} /> DOWNLOAD PDF
          </button>

        </div>

      </div>
    </div>
  );
};

/* Stat Card */
const StatCard = ({ label, value, color, textColor = "text-slate-800" }) => (
  <div className={`bg-white p-5 sm:p-6 rounded-[1.8rem] sm:rounded-[2rem] border-b-4 ${color} shadow-sm`}>
    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
      {label}
    </p>

    <p className={`text-2xl sm:text-3xl font-[1000] mt-1 ${textColor}`}>
      ₹{value || 0}
    </p>
  </div>
);

export default FeesPage;
