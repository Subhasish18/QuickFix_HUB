const express = require('express');
const router = express.Router();
const { getAdminDashboard } = require('../controllers/admin.controller');
<<<<<<< HEAD
const { verifyFirebaseToken } = require('../middleware/AuthMiddleware');
=======
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
>>>>>>> 1b2c335460deac2bd9d27e42bbab1139fabf43b1

router.get('/dashboard', verifyFirebaseToken, getAdminDashboard);

module.exports = router;
