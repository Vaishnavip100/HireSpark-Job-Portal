const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Log the start of the process
  console.log('--- Protect Middleware ---');
  console.log('Headers:', req.headers.authorization);
  console.log('------------------------');

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found:', token);

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully. User ID:', decoded.id);

      // 3. Get user from the token and attach it to the request object
      req.user = await User.findById(decoded.id).select('-password');
      
      // CRITICAL CHECK: Make sure a user was actually found with that ID
      if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user for this token no longer exists' });
      }
      
      console.log('User found in DB and attached to request:', req.user);
      
      next();

    } catch (error) {
      console.error('---!!! TOKEN VERIFICATION FAILED !!!---');
      console.error(error.message);
      console.error('---!!! END OF ERROR !!!---');
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // This block runs if there's no 'Authorization' header at all
  if (!token) {
    console.log('No token found in headers.');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;