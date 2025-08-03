const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  authUser, 
  getUserProfile,
  updateUserProfile,
  extractSkillsFromText
} = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

// --- PUBLIC ROUTES ---
router.post('/register', registerUser);
router.post('/login', authUser);


// Route for getting and updating the logged-in user's profile
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Route for the AI skill extraction feature
router.post('/extract-skills', protect, extractSkillsFromText);

module.exports = router;