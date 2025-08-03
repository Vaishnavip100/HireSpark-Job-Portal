import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ApplicationModalProps {
  jobId: string; 
  onClose: () => void; 
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ jobId, onClose }) => {
  const [educationDetails, setEducationDetails] = useState({
    schoolPercentage: '',
    interPercentage: '',
    collegeCgpa: '',
  });

  // State for the resume file
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  // State for loading and error messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handler for text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEducationDetails(prev => ({ ...prev, [name]: value }));
  };

  // Handler for file input changes
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
    
    setIsLoading(true);
    setError(null);

    const formData = new FormData(); 
    formData.append('schoolPercentage', educationDetails.schoolPercentage);
    formData.append('interPercentage', educationDetails.interPercentage);
    formData.append('collegeCgpa', educationDetails.collegeCgpa);
    formData.append('resume', resumeFile); 

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const token = userInfo ? userInfo.token : null;

    if (!token) {
      setError('You must be logged in to apply.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/applications/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert('Application submitted successfully!');
        onClose(); 
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('Submission failed. Please check your connection and try again.');
      console.error('Submission failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Modal Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Apply for Job</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Education Details Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Education Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                name="schoolPercentage"
                value={educationDetails.schoolPercentage}
                onChange={handleInputChange}
                placeholder="School %"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="number"
                name="interPercentage"
                value={educationDetails.interPercentage}
                onChange={handleInputChange}
                placeholder="Intermediate %"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="number"
                name="collegeCgpa"
                step="0.01"
                value={educationDetails.collegeCgpa}
                onChange={handleInputChange}
                placeholder="College CGPA"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Resume Upload Section */}
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700" htmlFor="resume">
              Upload Resume
            </label>
            <input
              id="resume"
              type="file"
              name="resume"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept=".pdf,.doc,.docx"
              required
            />
            <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX only. Max size 2MB.</p>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm">{error}</div>}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400"
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;