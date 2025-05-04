const express = require('express');
const router = express.Router();
const { getAdminDashboard } = require('../controllers/admin.controller');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');

router.get('/dashboard', verifyFirebaseToken, getAdminDashboard);

module.exports = router;
