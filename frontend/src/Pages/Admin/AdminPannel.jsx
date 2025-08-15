
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserTable from './UserTable';
import ProviderTable from './ProviderTable';
import BookingTable from './BookingTable';
import Navbar from '../UserLandingPage/Navbar';
import { useNavigate } from 'react-router-dom';


const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      const adminData = JSON.parse(localStorage.getItem('userData'));
      if (!adminData || adminData.role !== 'admin') {
        alert('Access Denied: You must be an admin to view this page.');
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const [usersRes, providersRes, bookingsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users'),
          axios.get('http://localhost:5000/api/admin/providers'),
          axios.get('http://localhost:5000/api/admin/bookings'),
        ]);
        setUsers(usersRes.data.users || []);
        setProviders(providersRes.data.providers || []);
        setBookings(bookingsRes.data.bookings || []);
      } catch (err) {
        alert('Failed to fetch admin data. Please ensure the server is running.');
        console.error("Admin data fetch error:", err);
      }
      setLoading(false);
    };
    fetchAll();
  }, [navigate]);

  const handleDeleteProvider = async (providerId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/providers/${providerId}`);
      setProviders(providers.filter(p => p._id !== providerId));
      setBookings(bookings.filter(b => b.serviceId !== providerId)); 
      alert('Provider deleted successfully.');
    } catch (err) {
      alert('Failed to delete provider.');
      console.error("Provider delete error:", err);
    }
  };
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      setBookings(bookings.filter(b => b.userId !== userId));
      alert('User deleted successfully.');
    } catch (err) {
      alert('Failed to delete provider.');
      console.error("User delete error:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center">Loading admin data...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          <UserTable users={users} onDelete={handleDeleteUser} />
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Service Providers</h2>
          <ProviderTable providers={providers} onDelete={handleDeleteProvider} />
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
          <BookingTable bookings={bookings} />
        </div>

      </div>
    </>
  );
};

export default AdminPanel;