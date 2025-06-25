import React from 'react';

const BookingForm = () => (
  <div className="card p-4">
    <h3 className="mb-3">Book This Professional</h3>
    <form>
      <div className="mb-3">
        <label className="form-label">Your Name</label>
        <input type="text" className="form-control" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Date</label>
        <input type="date" className="form-control" required />
      </div>
      {/* <div className="mb-3">
        <label className="form-label">Time Slot</label>
        <select className="form-select" required>
          <option value="">Select a time slot</option>
          <option value="09:00-10:00">09:00 - 11:00 AM</option>
          <option value="10:00-11:00">11:30 - 01:30 PM</option>
          <option value="11:00-12:00">02:00 - 04:00 PM</option>
          <option value="14:00-15:00">04:30 - 06:30 PM</option>
        </select>
      </div> */}
      <div className="mb-3">
        <label className="form-label">Details of Service Required</label>
        <textarea className="form-control" rows="3" required />
      </div>
      <button type="submit" className="btn btn-primary w-100">Book Now</button>
    </form>
  </div>
);

export default BookingForm;