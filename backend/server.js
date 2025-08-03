const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');

// --- 1. Import all your route files ---
const jobRoutes = require('./routes/jobRoutes');
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
dotenv.config();
connectDB();

const app = express();

// --- 2. Apply Middleware ---
app.use(cors());

// Enable the Express body parser to read JSON from request bodies
app.use(express.json());

// --- 3. Serve Static Files ---
// Make the 'uploads' folder publicly accessible. This allows the frontend
// to display resumes by linking to, for example, http://localhost:5001/uploads/resume-123.pdf
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- 4. Mount all your API routers ---
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/posts', postRoutes); 

const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => console.log(`Backend server is running on port ${PORT}`));