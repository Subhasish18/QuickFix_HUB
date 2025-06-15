// backend/middleware/AuthMiddleware.js
import adminFirebase from '../firebase.js';

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await adminFirebase.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Store user info for next middleware/route
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Firebase token', error });
  }
};

export { verifyFirebaseToken };
