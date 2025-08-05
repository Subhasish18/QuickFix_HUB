
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
          <UserTable users={users} />
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Service Providers</h2>
          <ProviderTable providers={providers} />
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