import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Check, CreditCard, Shield, Clock, DollarSign, IndianRupee } from "lucide-react"; 
import Navbar from "../UserLandingPage/Navbar";
import razorpayLogo from "../../assets/razor.svg";
import Footer from "../UserLandingPage/Footer";


const PaymentPage = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Only allow access if userData exists and role is 'user'
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || userData.role !== 'user') {
      alert('Please login as user to access the payment page.');
      navigate('/login', { replace: true });
    }
  }, [navigate]);
   const selectedService = location.state?.service;
  const providerId = selectedService?.id || location.state?.serviceId;
  useEffect(() => {
      if (!providerId || !selectedService) {
        alert('Invalid access. Please select a service provider first.');
        navigate('/#services', { replace: true });
      }
    }, [providerId, selectedService, navigate]);
  
  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      console.log(`Payment of ₹{amount} processed.`);
      alert("Payment successful!");
      navigate("/dashboard"); 
    }, 2000);
  };

  const numericAmount = parseFloat(amount) || 0;
  const isValidAmount = numericAmount > 0;


return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="bg-white border border-slate-200 rounded-xl shadow-lg">
          <div className="p-8">

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100/60 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-semibold text-slate-800 mb-2">
                Complete Your Payment
              </h1>
              <p className="text-slate-500">
                Secure checkout powered by industry-leading encryption
              </p>
            </div>


            <div className="mb-8">
              <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
                Enter Amount
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <IndianRupee className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full rounded-md border-slate-300 pl-10 h-12 text-lg focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                />
              </div>
               {amount && !isValidAmount && (
                  <p className="text-sm text-red-600 mt-1">Please enter a valid amount.</p>
               )}
            </div>

            <div className="flex justify-center mb-8">
              <a href="https://razorpay.com" target="_blank" rel="noopener noreferrer">
                <img
                  src={razorpayLogo}
                  alt="Razorpay logo"
                  className="h-8"
                  />
                </a>
              </div>

            <button
              onClick={handlePayNow}
              disabled={isProcessing || !isValidAmount}
              className="w-full h-12 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-lg transition-all duration-200 shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : isValidAmount ? (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ${numericAmount.toFixed(2)} Now
                </>
              ) : (
                "Enter Amount to Pay"
              )}
            </button>

            <p className="text-xs text-slate-500 text-center mt-4">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            Questions? Contact our support team
          </p>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;