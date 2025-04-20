const getAdminDashboard = async (req, res) => {
    res.json({
      message: 'Welcome to the Admin Dashboard (Firebase Verified)',
      user: req.user,
    });
  };
  
  module.exports = {
    getAdminDashboard,
  };
  