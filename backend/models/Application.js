const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Job', // Links to the Job model
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Links to the User model
  },
  status: {
    type: String,
    required: true,
    enum: ['Applied', 'Viewed', 'Shortlisted', 'Rejected'],
    default: 'Applied',
  },
  resumePath: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;