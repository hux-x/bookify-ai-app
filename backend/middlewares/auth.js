import jwt from 'jsonwebtoken';
import User from '../models/user.models.js'
// Middleware to verify JWT
const authenticateToken =  (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    console.log(authHeader,"inside middleware")
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET,async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      // Attach decoded user data to req object
      console.log(decoded)
      req.user = await User.findById(decoded.id).select('-password')
      next();
    });
  } catch (error) {
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
};

export default authenticateToken;
