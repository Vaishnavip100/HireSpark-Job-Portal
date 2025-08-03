import React, { useState, useEffect } from 'react';
import { Job, UserInfo } from '../types';

const API_URL = 'https://hirespark-job-portal-backend.onrender.com';

interface JobsPostedPageProps {
  userInfo: UserInfo;
  onNavigate: (page: string, data?: any) => void;
}

const JobsPostedPage: React.FC<JobsPostedPageProps> = ({ userInfo, onNavigate }) => {
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/jobs/myjobs`, {
          headers: { 'Authorization': `Bearer ${userInfo.token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch your jobs.');
        setMyJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyJobs();
  }, [userInfo.token]);

  if (loading) return <div className="text-center py-20">Loading your posted jobs...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Jobs You've Posted</h1>
      {myJobs.length === 0 ? (
        <div className="bg-white p-8 rounded-lg text-center">
          <p>You have not posted any jobs yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myJobs.map(job => (
            <div key={job._id} className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500 mt-2">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
              <div>

                <button 
                  onClick={() => onNavigate('view-applicants', { jobId: job._id })}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  View Applicants
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPostedPage;
