const recruiter = (req, res, next) => {
  console.log('--- Recruiter Middleware ---');
  console.log('Checking user role. req.user:', req.user);
  console.log('--------------------------');
  
  if (req.user && req.user.role === 'Recruiter') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Route requires recruiter permissions.' });
  }
};
module.exports = recruiter;