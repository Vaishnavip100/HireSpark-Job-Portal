const Job = require('../models/Job');
const Company = require('../models/Company');

const getJobs = async (req, res) => {
  try {
    const { 
      searchTerm, jobTitle, location, category, jobTypes, locations, 
      categories, salaryRange, experienceRange, sortBy 
    } = req.query;

    let filter = {};
    const andConditions = [];

    // Search term from main search bar
    if (searchTerm) {
      andConditions.push({
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { company: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
        ]
      });
    }

    // Individual filters from HeroSection
    if (jobTitle) {
      andConditions.push({ title: { $regex: jobTitle, $options: 'i' } });
    }
        if (location) andConditions.push({ location: { $regex: location, $options: 'i' } });
    if (category) andConditions.push({ category: category });

    // Array-based filters from the sidebar (Job Type, Category checkboxes)
    if (jobTypes) {
      andConditions.push({ type: { $in: jobTypes.split(',') } });
    }
    if (categories) {
      andConditions.push({ category: { $in: categories.split(',') } });
    }
    
    // Special handling for Location array to include "Work from home"
    if (locations) {
      const locationValues = locations.split(',');
      const locationQueries = locationValues.map(loc => ({ location: { $regex: loc, $options: 'i' } }));
      
      // If "Work from home" is selected, we also check the boolean 'remote' field
      if (locationValues.includes('Work from home')) {
        locationQueries.push({ remote: true });
      }
      
      andConditions.push({ $or: locationQueries });
    }

    // Range filters for Salary and Experience
    if (salaryRange && Number(salaryRange) > 0) {
      andConditions.push({ salaryMin: { $gte: Number(salaryRange) } });
    }
    if (experienceRange && Number(experienceRange) > 0) {
      andConditions.push({ experienceRequired: { $gte: Number(experienceRange) } });
    }

    // Combine all conditions into a single query
    if (andConditions.length > 0) {
      filter = { $and: andConditions };
    }

    // Sorting logic
    let sortOption = {};
    switch (sortBy) {
      case 'Newest First': sortOption = { createdAt: -1 }; break;
      case 'Oldest First': sortOption = { createdAt: 1 }; break;
      case 'Salary High to Low': sortOption = { salaryMax: -1 }; break;
      case 'Salary Low to High': sortOption = { salaryMin: 1 }; break;
      default: sortOption = { createdAt: -1 };
    }

    console.log("Executing DB query with filter:", JSON.stringify(filter, null, 2));

    const jobs = await Job.find(filter).sort(sortOption);
    res.json(jobs);

  } catch (error) {
    console.error("Error in getJobs:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// CREATE a new job (private, recruiter only)
const createJob = async (req, res) => {
  try {
    const { title, company, description, skills, transactionHash } = req.body;
    if (!transactionHash) {
      return res.status(400).json({ message: 'Payment transaction hash is required.' });
    }
    const newJob = new Job({
      ...req.body,
      skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
      recruiter: req.user._id,
    });
    const createdJob = await newJob.save();
    await Company.findOneAndUpdate({ name: company }, { $inc: { openPositions: 1 } }, { upsert: true });
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET a single job by ID (public)
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET jobs posted by the logged-in recruiter (private, recruiter only)
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching recruiter jobs:', error);
    res.status(500).json({ message: 'Server Error while fetching your jobs' });
  }
};

module.exports = { 
  getJobs, 
  createJob, 
  getJobById, 
  getMyJobs 
};