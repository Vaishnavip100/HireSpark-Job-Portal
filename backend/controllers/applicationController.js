const Application = require('../models/Application');
const User = require('../models/User');
const Job = require('../models/Job');

const getMyApplications = async (req, res) => {
  try {
    // 1. Find all applications made by the currently logged-in user
    const applications = await Application.find({ applicant: req.user._id })
      .sort({ createdAt: -1 })
      // 2. Populate the 'job' field with the full job document
      .populate('job'); 

    res.json(applications);
  } catch (error) {
    console.error('Error fetching my applications:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const applyToJob = async (req, res) => {
  const jobId = req.params.id;
  const applicantId = req.user._id;

  try {
    // 1. Check if user already applied for this job
    const existingApplication = await Application.findOne({ job: jobId, applicant: applicantId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // 2. Check if resume file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    const { schoolPercentage, interPercentage, collegeCgpa, skills } = req.body;

    // 3. Find the user to update their details
    const userToUpdate = await User.findById(applicantId);
    if (!userToUpdate) {
        return res.status(404).json({ message: 'User not found' });
    }

    userToUpdate.education.schoolPercentage = schoolPercentage;
    userToUpdate.education.interPercentage = interPercentage;
    userToUpdate.education.collegeCgpa = collegeCgpa;

    if (skills && typeof skills === 'string') {
        userToUpdate.skills = skills.split(',').map(skill => skill.trim());
    }
    // 4. Save the updated user profile
    await userToUpdate.save();

    // 5. Create the new application record
    const application = new Application({
      job: jobId,
      applicant: applicantId,
      resumePath: req.file.path, 
    });

    await application.save();
    
    // 6. Send success response
    res.status(201).json({ message: 'Application submitted successfully' });

  } catch (error) {
    console.error('ERROR APPLYING TO JOB:', error); 
    res.status(500).json({ message: 'Server Error' }); 
  }
};
const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const recruiterId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    if (job.recruiter.toString() !== recruiterId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these applicants.' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email skills education'); 

    res.json(applications);

  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { 
  applyToJob,
  getJobApplicants, 
  getMyApplications 
};