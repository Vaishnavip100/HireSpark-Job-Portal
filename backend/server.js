const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');

const jobRoutes = require('./routes/jobRoutes');
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
dotenv.config();
connectDB();

const app = express();
const corsOptions = {
  origin: 'https://hirespark-job-portal-frontend.onrender.com', 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/posts', postRoutes); 

const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => console.log(`Backend server is running on port ${PORT}`));
