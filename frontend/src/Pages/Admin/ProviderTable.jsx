import React from 'react';

const ProviderTable = ({ providers, onDelete, onView }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Providers</h3>
      <table className="table table-bordered w-full">
        <thead>
          <tr>
            <th>Provider ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers && providers.length > 0 ? (
            providers.map(p => (
              <tr key={p._id}>
                <td>{p._id}</td>
                <td>{p.name}</td>
                <td>{p.location}</td>
                <td>{p.email || 'N/A'}</td>
                <td>
                  <button onClick={() => onView && onView(p._id)} className="btn btn-info btn-sm mx-1">View</button>
                  <button onClick={() => onDelete && onDelete(p._id)} className="btn btn-danger btn-sm mx-1">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No providers found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProviderTable;