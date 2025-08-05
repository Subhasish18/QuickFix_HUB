import React from 'react';

const BookingTable = ({ bookings }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Bookings</h3>
      <table className="table table-bordered w-full">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User</th>
            <th>Provider</th>
            <th>Status</th>
            <th>Scheduled Time</th>
            <th>Service Details</th>
          </tr>
        </thead>
        <tbody>
          {bookings && bookings.length > 0 ? (
            bookings.map(b => (
              <tr key={b._id}>
                <td>{b._id}</td>
                <td>{b.userId?.name || 'N/A'}</td>
                <td>{b.serviceId?.name || 'N/A'}</td>
                <td>{b.status}</td>
                <td>{new Date(b.scheduledTime).toLocaleString()}</td>
                <td>{b.serviceDetails}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No bookings found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;