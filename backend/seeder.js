const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const Job = require('./models/Job');
const Company = require('./models/Company');
const User = require('./models/User');
const jobs = require('./data/jobs');
const companies = require('./data/companies');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Clear all previous data from the database
    await Job.deleteMany();
    await Company.deleteMany();
    await User.deleteMany();
    console.log('Previous data destroyed...');

    // 2. Create a default Admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123', // This will be hashed automatically by the model
    });

    const adminUserId = adminUser._id;
    console.log('Admin user created...');

    // 3. Prepare the sample jobs by adding the Admin user's ID to each one
    const sampleJobs = jobs.map(job => {
      return { ...job, user: adminUserId }; // Assign ownership to the admin
    });

    // 4. Import the companies and the newly prepared jobs
    await Company.insertMany(companies);
    console.log('Sample companies imported...');
    
    await Job.insertMany(sampleJobs);
    console.log('Sample jobs (owned by Admin) imported...');

    console.log('---');
    console.log('Data Imported Successfully!');
    console.log('You can log in with:');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
    console.log('---');
    process.exit();

  } catch (error) {
    console.error(`Error during data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Job.deleteMany();
    await Company.deleteMany();
    await User.deleteMany();
    console.log('All Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}