const express = require('express');
const router = express.Router();
const { applyToJob, getJobApplicants, getMyApplications } = require('../controllers/applicationController'); // <-- Import new function
const protect = require('../middleware/authMiddleware');
const recruiter = require('../middleware/recruiterMiddleware');
const upload = require('../middleware/uploadMiddleware');

// This route is for a user to see the jobs they have applied for.
router.route('/myapplications').get(protect, getMyApplications);

// Route for a Job Seeker to apply to a job
router.route('/:id/apply').post(protect, upload, applyToJob);

// Route for a Recruiter to view applicants for their job
router.route('/:id/applicants').get(protect, recruiter, getJobApplicants);

module.exports = router;