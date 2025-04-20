const adminFirebase = require('../firebase');

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await adminFirebase.auth().verifyIdToken(idToken);

    // You can add role-based check here
    if (decodedToken.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Not an admin' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Firebase token', error });
  }
};

module.exports = {
  verifyFirebaseToken,
};
