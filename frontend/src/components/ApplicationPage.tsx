import React, { useState, useEffect } from 'react';
import { Job, UserInfo } from '../types';

const API_URL = 'https://hirespark-job-portal-backend.onrender.com';

interface ApplicationPageProps {
  jobId: string;
  userInfo: UserInfo;
  onApplicationSuccess: () => void;
}

const ApplicationPage: React.FC<ApplicationPageProps> = ({ jobId, userInfo, onApplicationSuccess }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    schoolPercentage: '',
    interPercentage: '',
    collegeCgpa: '',
    skills: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch both the job details and the user's profile to pre-fill the form
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch job details
        const jobRes = await fetch(`${API_URL}/api/jobs/${jobId}`);
        if (!jobRes.ok) throw new Error('Could not fetch job details.');
        const jobData = await jobRes.json();
        setJob(jobData);

        // Fetch user profile to pre-fill skills
        const profileRes = await fetch(`${API_URL}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${userInfo.token}` }
        });
        if (!profileRes.ok) throw new Error('Could not fetch user profile.');
        const profileData = await profileRes.json();
        setFormData(prev => ({ ...prev, skills: (profileData.skills || []).join(', ') }));

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId, userInfo.token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      setError('Please upload your resume.');
      return;
    }
    setLoading(true);
    
    const submissionData = new FormData();
    submissionData.append('schoolPercentage', formData.schoolPercentage);
    submissionData.append('interPercentage', formData.interPercentage);
    submissionData.append('collegeCgpa', formData.collegeCgpa);
    submissionData.append('skills', formData.skills);
    submissionData.append('resume', resumeFile);

    try {
      const res = await fetch(`${API_URL}/api/applications/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userInfo.token}` },
        body: submissionData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed.');

      alert('Application submitted successfully!');
      onApplicationSuccess();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading Application Form...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  if (!job) return <div className="text-center py-20">Job not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2">Apply for {job.title}</h1>
        <p className="text-lg text-gray-600 mb-8">at {job.company}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Education Section */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Your Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="number" name="schoolPercentage" placeholder="School %" onChange={handleInputChange} required className="form-input" />
              <input type="number" name="interPercentage" placeholder="Intermediate %" onChange={handleInputChange} required className="form-input" />
              <input type="number" name="collegeCgpa" step="0.01" placeholder="College CGPA" onChange={handleInputChange} required className="form-input" />
            </div>
          </div>
          {/* Skills Section */}
          <div>
            <label className="block text-xl font-semibold mb-3 text-gray-800" htmlFor="skills">Your Skills</label>
            <input id="skills" name="skills" type="text" value={formData.skills} onChange={handleInputChange} placeholder="e.g., React, Node.js, Solidity" required className="form-input w-full" />
            <p className="text-sm text-gray-500 mt-1">Comma-separated skills. These will be updated on your profile.</p>
          </div>
          {/* Resume Section */}
          <div>
            <label className="block text-xl font-semibold mb-3 text-gray-800" htmlFor="resume">Upload Resume</label>
            <input id="resume" type="file" name="resume" onChange={handleFileChange} required accept=".pdf,.doc,.docx" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationPage;
