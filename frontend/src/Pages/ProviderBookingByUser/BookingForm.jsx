import React, { useState } from 'react';
import axios from 'axios';

const BookingForm = ({ serviceId, userId }) => {
  const [form, setForm] = useState({
    scheduledTime: '',
    serviceDetails: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!serviceId || !userId) {
        alert('Service ID or User ID is missing!');
        setLoading(false);
        return;
      }

      const payload = {
        userId,
        serviceId,
        scheduledTime: form.scheduledTime,
        serviceDetails: form.serviceDetails
      };

      const res = await axios.post('http://localhost:5000/api/bookings', payload);
      alert(res.data.message || 'Booking successful!');
      setForm({ scheduledTime: '', serviceDetails: '' });
    } catch (err) {
      alert('Booking failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <h3 className="mb-3">Book This Professional</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Date & Time</label>
          <input
            type="datetime-local"
            className="form-control"
            name="scheduledTime"
            value={form.scheduledTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Details of Service Required</label>
          <textarea
            className="form-control"
            rows="3"
            name="serviceDetails"
            value={form.serviceDetails}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
