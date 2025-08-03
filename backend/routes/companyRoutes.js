const express = require('express');
const router = express.Router();
const { getJobs, createJob, getJobById, getMyJobs } = require('../controllers/jobController');
const protect = require('../middleware/authMiddleware');
const recruiter = require('../middleware/recruiterMiddleware');

router.route('/').get(getJobs).post(protect, recruiter, createJob);
router.route('/myjobs').get(protect, recruiter, getMyJobs);
router.route('/:id').get(getJobById);

module.exports = router;