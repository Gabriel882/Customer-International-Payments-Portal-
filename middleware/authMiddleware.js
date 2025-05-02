const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header (assuming Bearer token format)
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Remove "Bearer " from token

  // If there's no token, or it's an empty string, send a response with a 403 status
  if (!token || token.trim() === '') {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the JWT_SECRET key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to the request object, so it can be accessed by subsequent middleware
    req.user = decoded;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails (e.g., invalid or expired token), send an error response
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
