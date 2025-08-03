import React, { useState, useEffect } from 'react';
import { Job, UserInfo } from '../types';

const API_URL = 'http://localhost:5001';

interface ApplicationWithJob {
  _id: string;
  job: Job;
  status: string;
  createdAt: string; 
}

interface AppliedJobsPageProps {
  userInfo: UserInfo;
}

const AppliedJobsPage: React.FC<AppliedJobsPageProps> = ({ userInfo }) => {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/applications/myapplications`, {
          headers: { 'Authorization': `Bearer ${userInfo.token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch applied jobs.');
        setApplications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedJobs();
  }, [userInfo.token]);

  if (loading) return <div className="text-center py-20">Loading your applications...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Jobs You've Applied For</h1>
      {applications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg text-center">
          <p>You have not applied for any jobs yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app._id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{app.job.title}</h2>
                  <p className="text-gray-600">{app.job.company}</p>
                  <p className="text-sm text-gray-500 mt-2">{app.job.location} | {app.job.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                  <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    app.status === 'Applied' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    Status: {app.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobsPage;