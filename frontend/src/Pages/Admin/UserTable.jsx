import React from 'react';

const UserTable = ({ users, onDelete, onView }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Users</h3>
      <table className="table table-bordered w-full">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map(u => (
              <tr key={u._id}>
                <td>{u._id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <button onClick={() => onView && onView(u._id)} className="btn btn-info btn-sm mx-1">View</button>
                  <button onClick={() => onDelete && onDelete(u._id)} className="btn btn-danger btn-sm mx-1">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;