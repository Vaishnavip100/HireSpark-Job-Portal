const express = require('express');
const router = express.Router();
const { getJobs, createJob, getJobById, getMyJobs } = require('../controllers/jobController');
const protect = require('../middleware/authMiddleware');
const recruiter = require('../middleware/recruiterMiddleware'); 

// GET all jobs (public) & POST a new job (private, recruiters only)
router.route('/').get(getJobs).post(protect, recruiter, createJob);

// GET jobs posted by the logged-in recruiter (private, recruiters only)
router.route('/myjobs').get(protect, recruiter, getMyJobs);

// GET a single job by its ID (public)
router.route('/:id').get(getJobById);

module.exports = router;