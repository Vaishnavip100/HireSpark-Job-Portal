// backend/controllers/userController.js

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// --- THIS IS THE MISSING SKILLS LIST ---
// A predefined list of skills for the AI feature. You can add more to this list.
const skillsList = [
  'c','javascript', 'react', 'node.js', 'express.js', 'mongodb', 'sql', 'python', 'java',
  'c++', 'aws', 'docker', 'kubernetes', 'html', 'css', 'tailwindcss', 'solidity', 'rust',
  'web3.js', 'ethers.js', 'solana', 'polygon', 'ethereum', 'machine learning', 'nlp', 'mern'
];
// --- END OF SKILLS LIST ---

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields including role are required.' });
  }
  if (!['Job Seeker', 'Recruiter'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password, role });
    if (user) {
      const responsePayload = {
        _id: user._id, name: user.name, email: user.email,
        role: user.role, token: generateToken(user._id),
      };
      res.status(201).json(responsePayload);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const responsePayload = {
        _id: user._id, name: user.name, email: user.email,
        role: user.role, token: generateToken(user._id),
      };
      res.json(responsePayload);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      bio: user.bio, linkedinUrl: user.linkedinUrl, skills: user.skills,
      walletAddress: user.walletAddress, education: user.education
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.linkedinUrl = req.body.linkedinUrl || user.linkedinUrl;
    user.walletAddress = req.body.walletAddress || user.walletAddress;
    
    if (typeof req.body.skills === 'string') {
        user.skills = req.body.skills.split(',').map(skill => skill.trim());
    }
    
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
      role: updatedUser.role, bio: updatedUser.bio, linkedinUrl: updatedUser.linkedinUrl,
      skills: updatedUser.skills, walletAddress: updatedUser.walletAddress,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// backend/controllers/userController.js

// ... (keep the User and generateToken imports and the skillsList array)

// ... (keep the registerUser, authUser, getUserProfile, and updateUserProfile functions)

// --- THIS IS THE CORRECTED AI FUNCTION ---
const extractSkillsFromText = async (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
        return res.status(400).json({ message: 'Please provide text to analyze.' });
    }
    const foundSkills = new Set();
    const lowerCaseText = text.toLowerCase();
    
    skillsList.forEach(skill => {
        // --- THIS IS THE FIX ---
        // We create a function to escape special regex characters.
        const escapeRegExp = (string) => {
          return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        };
        
        // Now we use the escaped skill to build the regex
        const escapedSkill = escapeRegExp(skill);
        const regex = new RegExp(`\\b${escapedSkill}\\b`, 'gi');
        
        if (lowerCaseText.match(regex)) {
            foundSkills.add(skill);
        }
    });
    
    res.json(Array.from(foundSkills));
};

// --- Make sure your exports are correct ---
module.exports = { 
  registerUser, 
  authUser,
  getUserProfile,
  updateUserProfile,
  extractSkillsFromText
};