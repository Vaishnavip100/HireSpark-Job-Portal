const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const educationSchema = new mongoose.Schema({
  schoolPercentage: { type: Number },
  interPercentage: { type: Number },
  collegeCgpa: { type: Number },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Job Seeker', 'Recruiter'],
    required: [true, 'Please specify a role'], 
    default: 'Job Seeker',
  },
  bio: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  skills: { type: [String], default: [] },
  walletAddress: { type: String, default: '' },
  education: { type: educationSchema, default: {} },
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;