import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDialog from '../../components/shared/ConfirmDialog'; // Import your reusable ConfirmDialog

const BookingForm = ({ serviceId }) => {
  const [form, setForm] = useState({
    scheduledTime: '',
    serviceDetails: ''
  });
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData?.id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // This will only trigger when user clicks "Yes, Confirm" in modal
  const confirmBooking = async () => {
    setShowConfirm(false);
    setLoading(true);

    try {
      if (!serviceId || !userId) {
        toast.error('Service ID or User ID is missing!');
        setLoading(false);
        return;
      }

      const { scheduledTime, serviceDetails } = form;
      const bookingData = {
        userId,
        serviceId,
        scheduledTime,
        serviceDetails
      };

      const res = await axios.post('https://quickfix-hub.onrender.com/api/bookings', bookingData);

      toast.success(res.data.message || 'Booking successful! 🎉');
      setForm({ scheduledTime: '', serviceDetails: '' });
    } catch (err) {
      console.error('Booking failed:', err);
      toast.error(err.response?.data?.message || 'Booking failed! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true); // show confirmation dialog instead of submitting immediately
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto backdrop-blur-sm border border-gray-100">
      {/* Background decoration */}
      <div className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-xl -z-10"></div>
      <div className="absolute -bottom-2 -left-2 w-32 h-32 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-xl -z-10"></div>
      
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Book This Professional</h3>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date & Time Field */}
        <div className="relative group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>Date & Time</span>
            </div>
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              className="w-full px-4 py-3 bg-gray-50/70 border-2 border-gray-200 rounded-xl
                       focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/50
                       transition-all duration-300 ease-in-out
                       hover:border-blue-300 hover:shadow-md hover:bg-white/80
                       text-gray-800 text-base font-medium
                       [color-scheme:light]
                       [&::-webkit-calendar-picker-indicator]:opacity-70
                       [&::-webkit-calendar-picker-indicator]:hover:opacity-100
                       [&::-webkit-calendar-picker-indicator]:cursor-pointer
                       [&::-webkit-calendar-picker-indicator]:rounded-md
                       [&::-webkit-calendar-picker-indicator]:p-1
                       [&::-webkit-calendar-picker-indicator]:transition-all
                       [&::-webkit-calendar-picker-indicator]:duration-200"
              name="scheduledTime"
              value={form.scheduledTime}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
            {/* Calendar Icon Overlay */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/8 to-purple-500/8 opacity-0 
                          group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-xl shadow-inner opacity-0 
                          group-focus-within:opacity-30 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          {/* Helper text */}
          <p className="text-xs text-gray-500 mt-1 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
            Select your preferred date and time for the service
          </p>
        </div>

        {/* Service Details Field */}
        <div className="relative group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
            Details of Service Required
          </label>
          <div className="relative">
            <textarea
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl resize-none
                       focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100
                       transition-all duration-300 ease-in-out
                       hover:border-gray-300 hover:shadow-sm
                       text-gray-800 placeholder-gray-400"
              rows="4"
              name="serviceDetails"
              value={form.serviceDetails}
              onChange={handleChange}
              placeholder="Please describe your requirements in detail..."
              required
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 
                          group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white text-lg
                    transition-all duration-300 ease-in-out transform
                    ${loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:scale-105 active:scale-95'
                    }
                    focus:outline-none focus:ring-4 focus:ring-blue-200
                    shadow-md`}
          disabled={loading}
        >
          <div className="flex items-center justify-center space-x-2">
            {loading && (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
            <span>{loading ? 'Booking...' : 'Book Now'}</span>
          </div>
        </button>
      </form>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={confirmBooking}
        title="Confirm Booking"
        message="Are you sure you want to confirm this booking?"
      />
    </div>
  );
};

export default BookingForm;