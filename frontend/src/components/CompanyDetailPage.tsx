import React, { useState, useEffect, useCallback } from 'react'; 
import { Job, Company } from '../types';
import { Edit, Trash2, Briefcase, MapPin, Users } from 'lucide-react';

const API_URL = 'https://hirespark-job-portal-backend.onrender.com';

interface UserInfo {
  _id: string;
  name: string;
  token: string;
}

interface CompanyDetailPageProps {
  companyId: string;
  userInfo: UserInfo | null;
  onNavigate: (page: string) => void;
}

const CompanyDetailPage: React.FC<CompanyDetailPageProps> = ({ companyId, userInfo, onNavigate }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/companies/${companyId}`);
      if (!response.ok) {
        throw new Error('Company not found or failed to fetch data.');
      }
      const data = await response.json();
      setCompany(data.company);
      setJobs(data.jobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  const handleDelete = async (jobId: string) => {
    if (!userInfo) return alert('You must be logged in to delete a job.');
    
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await fetch(`${API_URL}/api/jobs/${jobId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${userInfo.token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to delete the job.');
        }
        
        fetchCompanyData();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'An error occurred');
      }
    }
  };

  const handleEdit = (job: Job) => {
    alert(`Editing job: "${job.title}". This would open an edit form.`);
  };

  if (loading) return <div className="loading-state">Loading company details...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;
  if (!company) return <div className="not-found">Company not found.</div>;

  return (
    <div className="company-detail-page">
      <button onClick={() => onNavigate('companies')} className="back-link">← Back to All Companies</button>
      
      <div className="company-header">
        <h1>{company.name}</h1>
        <p>{company.description}</p>
        <div className="company-meta-details">
          <span><MapPin size={16} /> {company.location}</span>
          <span><Users size={16} /> {company.employees} Employees</span>
          <span><Briefcase size={16} /> {company.industry}</span>
        </div>
      </div>

      <h2 className="jobs-list-title">Open Positions at {company.name} ({jobs.length})</h2>
      <div className="jobs-list">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job._id} className="job-row">
              <div className="job-info">
                <h3>{job.title}</h3>
                <p>{job.location} • {job.type}</p>
              </div>
              
              {userInfo && userInfo._id === job.user && (
                <div className="manage-buttons">
                  <button onClick={() => handleEdit(job)} className="edit-btn">
                    <Edit size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(job._id)} className="delete-btn-alt">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>There are currently no open positions listed for {company.name}.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailPage;
