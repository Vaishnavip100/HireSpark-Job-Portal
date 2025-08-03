const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  skills: { type: [String], required: true },
  location: { type: String, required: true },
  type: { type: String, required: true, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
  salary: { type: String },
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  remote: { type: Boolean, default: false },
  category: { type: String, required: true },
  experienceRequired: { type: Number, default: 0 },
  
  // It links this job to the User who posted it.
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  // We also need the transactionHash from your PostJobForm
  transactionHash: { type: String, required: true },

}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;