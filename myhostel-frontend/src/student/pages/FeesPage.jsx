import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const FeesPage = () => {
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'UPI',
    externalTransactionId: ''
  });

  // 1. Fetch Real-time Fee Details (Total, Dues, etc.)
  const fetchFees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/fee/my-fees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeeData(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load fee data");
      setLoading(false);
    }
  };

  useEffect(() => { fetchFees(); }, []);

  // 2. Handle Payment Submission
  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8080/api/fee/pay', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Professional 1-Minute Toast
      toast.success(res.data.message, {
        duration: 60000, // 1 Minute
        position: 'top-center',
        style: { border: '2px solid #fb923c', padding: '16px', color: '#7c2d12' },
      });

      fetchFees(); // Refresh data
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment Failed");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading Bahubali's Records...</div>;

  return (
    <div className="min-h-screen bg-orange-50 p-6 font-sans">
      <Toaster />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-800 mb-6">Hostel Fee Portal</h1>

        {/* Fee Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
            <p className="text-sm text-gray-500">Total Bill</p>
            <p className="text-2xl font-bold text-gray-800">Rs. {feeData?.totalAmount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Paid Amount</p>
            <p className="text-2xl font-bold text-green-600">Rs. {feeData?.paidAmount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
            <p className="text-sm text-gray-500">Remaining Dues</p>
            <p className="text-2xl font-bold text-red-600">Rs. {feeData?.totalAmount - feeData?.paidAmount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
            <h2 className="text-xl font-semibold text-orange-700 mb-4">Submit New Payment</h2>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount (Rs.)</label>
                <input 
                  type="number" required
                  className="w-full p-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Transaction ID (UTR/Ref)</label>
                <input 
                  type="text" required
                  placeholder="Paste your bank Ref ID here"
                  className="w-full p-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  onChange={(e) => setFormData({...formData, externalTransactionId: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg">
                Submit Payment Details
              </button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="bg-orange-100 p-6 rounded-2xl border-2 border-dashed border-orange-300 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold text-orange-900 mb-2">Download Latest Receipt</h2>
            <p className="text-sm text-orange-700 mb-4">Receipts are valid for today only. Secure your copy now.</p>
            <a 
              href="http://localhost:8080/api/fee/receipt/latest" 
              target="_blank" rel="noreferrer"
              className="bg-white text-orange-600 border border-orange-600 px-6 py-3 rounded-full font-bold hover:bg-orange-600 hover:text-white transition duration-300"
            >
              📥 Download PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesPage;