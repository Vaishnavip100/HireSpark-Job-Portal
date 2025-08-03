import React, { useState, useEffect } from 'react';
import { UserInfo } from '../types';

const API_URL = 'http://localhost:5001';

// This defines the structure of the applicant data we expect from the backend
interface Applicant {
  _id: string; 
  applicant: {
    _id: string;
    name: string;
    email: string;
    skills: string[];
    education?: {
      schoolPercentage?: number;
      interPercentage?: number;
      collegeCgpa?: number;
    }
  };
  resumePath: string;
}

interface ApplicantsPageProps {
  jobId: string;
  userInfo: UserInfo;
}

const ApplicantsPage: React.FC<ApplicantsPageProps> = ({ jobId, userInfo }) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await fetch(`${API_URL}/api/applications/${jobId}/applicants`, {
          headers: { 'Authorization': `Bearer ${userInfo.token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch applicants.');
        setApplicants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId, userInfo.token]);

  if (loading) return <div className="text-center py-20">Loading applicants...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Applicants</h1>
      <p className="text-lg text-gray-600 mb-8">
        Found {applicants.length} applicant{applicants.length !== 1 && 's'} for this job.
      </p>

      {applicants.length === 0 ? (
        <p>There are no applicants for this job yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {applicants.map(app => (
              <li key={app._id} className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">{app.applicant.name}</h3>
                    <p className="text-sm text-gray-500">{app.applicant.email}</p>
                    <div className="mt-2">
                      <strong>Skills:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(app.applicant.skills || []).map(skill => (
                          <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <a 
                    href={`${API_URL}/${app.resumePath.replace(/\\/g, '/')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    View Resume
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApplicantsPage;