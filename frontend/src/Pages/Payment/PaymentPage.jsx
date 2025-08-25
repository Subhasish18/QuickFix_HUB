import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, IndianRupee, Lock, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "../UserLandingPage/Navbar";
import razorpayLogo from "../../assets/razor.svg";
import Footer from "../UserLandingPage/Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import auth from "../../utils/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, price, service, serviceId } = location.state || {};

  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Only allow access if userData exists and role is 'user'
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || userData.role !== "user") {
      toast.error(
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
          Please login as user to access the payment page.
        </div>,
        { autoClose: 3000 }
      );
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Autofill amount from price if available
  useEffect(() => {
    if (price) {
      setAmount(price.toString());
    }
  }, [price]);

  const handlePayNow = async () => {
    setIsProcessing(true);
    setPasswordError("");
    try {
      // Verify password with Firebase
      const userData = JSON.parse(localStorage.getItem("userData"));
      await signInWithEmailAndPassword(auth, userData.email, password);

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update booking status via backend
      await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        { paymentStatus: "paid" }
      );

      toast.success(
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
          Payment successful. Please wait!
        </div>,
        { autoClose: 2000 }
      );
      toast.info(
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Redirecting to Booking Details...
        </div>,
        { autoClose: 2000 }
      );
      setTimeout(() => navigate("/userDetails"), 2000);
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setPasswordError("Incorrect password. Please try again.");
        toast.error(
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            Incorrect password. Please try again.
          </div>,
          { autoClose: 3000 }
        );
      } else {
        console.error("Payment failed:", error);
        toast.error(
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            Payment failed. Please try again.
          </div>,
          { autoClose: 3000 }
        );
      }
    } finally {
      setIsProcessing(false);
      if (passwordError) {
        setPassword("");
      } else {
        setShowConfirm(false);
        setPassword("");
      }
    }
  };

  const numericAmount = parseFloat(amount) || 0;
  const isValidAmount = numericAmount > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex flex-col">
      <style jsx>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes scale-up {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.15); }
          50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.25); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.5s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.4s ease-out forwards; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        .hover-lift:hover { transform: translateY(-2px); transition: transform 0.3s ease; }
      `}</style>

      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-8 relative overflow-hidden animate-glow">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-100/50 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full translate-y-10 -translate-x-10"></div>

            <div className="relative z-10">
              <div className="text-center mb-8 animate-fade-in">
                <div className="w-14 h-14 bg-teal-100/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <CreditCard className="w-7 h-7 text-teal-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Secure Payment
                </h1>
                <p className="text-gray-600 text-sm">
                  Complete your transaction with confidence
                </p>
              </div>

              {/* Amount Input */}
              <div className="mb-8 animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Payment Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <IndianRupee className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 pl-10 pr-4 py-3 text-base text-black focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    aria-label="Payment amount in INR"
                  />
                </div>
                {amount && !isValidAmount && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Please enter a valid amount.
                  </p>
                )}
              </div>

              {/* Razorpay Branding */}
              <div className="flex justify-center mb-8 animate-slide-in" style={{ animationDelay: '0.4s' }}>
                <a
                  href="https://razorpay.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-lift"
                >
                  <img src={razorpayLogo} alt="Razorpay logo" className="h-7 opacity-90 hover:opacity-100 transition-opacity" />
                </a>
              </div>

              {/* Pay Button */}
              <div className="animate-slide-in" style={{ animationDelay: '0.6s' }}>
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={isProcessing || !isValidAmount}
                  className="group w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white rounded-lg py-3 px-4 text-base font-semibold transition-all duration-300 hover-lift hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={isValidAmount ? `Pay ₹${numericAmount.toFixed(2)}` : "Enter amount to pay"}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2"></div>
                        <span>Processing...</span>
                      </>
                    ) : isValidAmount ? (
                      <>
                        <CreditCard className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        <span>Pay ₹{numericAmount.toFixed(2)}</span>
                      </>
                    ) : (
                      <span>Enter Amount</span>
                    )}
                  </div>
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                Your payment is protected with end-to-end encryption.
              </p>
            </div>
          </div>

          <div className="text-center mt-6 animate-fade-in" style={{ animationDelay: '1s' }}>
            <p className="text-sm text-gray-600">
              Need help? Contact our{" "}
              <a href="/support" className="text-teal-600 hover:text-teal-500 font-medium transition-colors">
                support team
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
      <ToastContainer position="top-center" autoClose={3000} theme="light" />

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 animate-scale-up">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">
              Confirm Your Payment
            </h2>
            <p className="text-gray-600 mb-6 text-center text-sm">
              Enter your password to authorize payment of{" "}
              <span className="font-semibold text-teal-600">₹{numericAmount.toFixed(2)}</span>.
            </p>
            <div className="mb-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 pl-10 pr-4 py-3 text-base text-black focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                  placeholder="Enter your password"
                  required
                  aria-label="Password to confirm payment"
                />
              </div>
              {passwordError && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {passwordError}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setPassword("");
                  setPasswordError("");
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover-lift transition disabled:opacity-50"
                disabled={isProcessing}
                aria-label="Cancel payment"
              >
                Cancel
              </button>
              <button
                onClick={handlePayNow}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold hover-lift transition disabled:opacity-50"
                disabled={isProcessing || !password}
                aria-label="Confirm payment"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Confirm Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;