const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  employees: { type: String },
  industry: { type: String, required: true },
  logo: { type: String },
  openPositions: { type: Number, default: 0 },
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;