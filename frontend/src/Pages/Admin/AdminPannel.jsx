import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, 
  Building2, 
  Calendar, 
  BarChart3, 
  TrendingUp,
  Activity,
  Shield,
  ChevronRight,
  X
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import UserTable from './UserTable';

import ProviderTable from './ProviderTable';
import BookingTable from './BookingTable';
import Navbar from '../UserLandingPage/Navbar';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import Footer from '../UserLandingPage/Footer';

const Toast = ({ message, type, onClose }) => {
  const toastStyles = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    info: 'bg-blue-500 border-blue-600',
    warning: 'bg-yellow-500 border-yellow-600'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${toastStyles[type]} text-white px-6 py-3 rounded-lg shadow-lg border-l-4 flex items-center space-x-2 min-w-[300px] animate-slide-in`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto text-white hover:text-gray-200">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};


const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [confirmData, setConfirmData] = useState(null);
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const refreshBookings = async () => {
    try {
      const bookingsRes = await axios.get('https://quickfix-hub.onrender.com/api/admin/bookings');
      setBookings(bookingsRes.data.bookings || []);
    } catch (err) {
      console.error("Bookings fetch error:", err);
      showToast('Failed to refresh bookings', 'error');
    }
  };

  const refreshUsers = async () => {
    try {
      const usersRes = await axios.get('https://quickfix-hub.onrender.com/api/admin/users');
      setUsers(usersRes.data.users || []);
    } catch (err) {
      console.error("Users fetch error:", err);
      showToast('Failed to refresh users', 'error');
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      const adminData = JSON.parse(localStorage.getItem('userData'));
      if (!adminData || adminData.role !== 'admin') {
        showToast('Access Denied: Please login as admin', 'error');
        navigate('/login', { replace: true });
        return;
      }

      setLoading(true);
      try {
        const [usersRes, providersRes, bookingsRes] = await Promise.all([
          axios.get('https://quickfix-hub.onrender.com/api/admin/users'),
          axios.get('https://quickfix-hub.onrender.com/api/admin/providers'),
          axios.get('https://quickfix-hub.onrender.com/api/admin/bookings'),
        ]);
        setUsers(usersRes.data.users || []);
        setProviders(providersRes.data.providers || []);
        setBookings(bookingsRes.data.bookings || []);
      } catch (err) {
        showToast('Failed to fetch admin data. Check server.', 'error');
        console.error("Admin data fetch error:", err);
      }
      setLoading(false);
    };
    fetchAll();
  }, [navigate]);

  const confirmDelete = (type, id) => {
    setConfirmData({ type, id });
  };

  const handleDelete = async () => {
    if (!confirmData) return;
    try {
      if (confirmData.type === "user") {
        await axios.delete(`https://quickfix-hub.onrender.com/api/admin/users/${confirmData.id}`);
        setUsers(users.filter(u => u._id !== confirmData.id));
        setBookings(bookings.filter(b => b.userId?._id !== confirmData.id));
        showToast('User deleted successfully', 'success');
      }
    } catch (err) {
      console.error("Delete failed:", err);
      showToast(`Failed to delete user: ${err.response?.data?.message || 'Try again'}`, 'error');
    } finally {
      setConfirmData(null);
    }
  };

  const getBookingStatusData = () => {
    const statusCounts = bookings.reduce((acc, booking) => {
      const status = booking.status?.toLowerCase() || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const colors = {
      confirmed: '#10b981',
      pending: '#f59e0b',
      cancelled: '#ef4444',
      completed: '#3b82f6'
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: colors[status] || '#6b7280'
    }));
  };

  const getMonthlyData = () => {
    const monthlyStats = bookings.reduce((acc, booking) => {
      const date = new Date(booking.scheduledTime);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthName, bookings: 0, users: new Set(), providers: new Set() };
      }
      
      acc[monthKey].bookings++;
      if (booking.userId?._id) acc[monthKey].users.add(booking.userId._id);
      if (booking.serviceId?._id) acc[monthKey].providers.add(booking.serviceId._id);
      
      return acc;
    }, {});

    return Object.values(monthlyStats)
      .map(item => ({
        ...item,
        users: item.users.size,
        providers: item.providers.size
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'providers', label: 'Providers', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: Calendar }
  ];

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Service Providers',
      value: providers.length,
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      change: '+23%',
      changeType: 'positive'
    },
    {
      title: 'Active Sessions',
      value: bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length,
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      change: '+5%',
      changeType: 'positive'
    }
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-700 font-medium">Loading admin dashboard...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg pt-2">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 pt-2">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage users, providers, and monitor platform activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-all duration-200 relative ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transform scale-x-100 transition-transform duration-200"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                    Booking Status Distribution
                  </h3>
                  {bookings.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={getBookingStatusData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {getBookingStatusData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No booking data available
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                    Monthly Activity
                  </h3>
                  {bookings.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={getMonthlyData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="bookings" fill="#3b82f6" name="Bookings" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="users" fill="#10b981" name="Active Users" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No activity data available
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Manage Users</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </button>
                  <button
                    onClick={() => setActiveTab('providers')}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-900">Manage Providers</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">View Bookings</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Users className="h-6 w-6 text-blue-600 mr-3" />
                    User Management
                  </h2>
                  <div className="text-sm text-gray-500">
                    Total registered users: {users.length}
                  </div>
                </div>
                <UserTable users={users} onRefresh={refreshUsers} />
              </div>
            </div>
          )}
          {activeTab === 'providers' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Building2 className="h-6 w-6 text-purple-600 mr-3" />
                    Provider Management
                  </h2>
                  <div className="text-sm text-gray-500">
                    Active service providers: {providers.length}
                  </div>
                </div>
                <ProviderTable providers={providers} onRefresh={async () => {
                  try {
                    const providersRes = await axios.get('https://quickfix-hub.onrender.com/api/admin/providers');
                    setProviders(providersRes.data.providers || []);
                  } catch (err) {
                    console.error("Providers fetch error:", err);
                    showToast('Failed to refresh providers', 'error');
                  }
                }} />
              </div>
            </div>
          )}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Calendar className="h-6 w-6 text-green-600 mr-3" />
                    Booking Management
                  </h2>
                  <div className="text-sm text-gray-500">
                    Total bookings: {bookings.length}
                  </div>
                </div>
                <BookingTable bookings={bookings} onRefresh={refreshBookings} />
              </div>
            </div>
          )}
        </div>

        {confirmData && (
          <ConfirmDialog
            title="Confirm Deletion"
            message={`Are you sure you want to delete this ${confirmData.type}?`}
            onCancel={() => setConfirmData(null)}
            onConfirm={handleDelete}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
      <Footer />
    </div>
  );
};

export default AdminPanel;