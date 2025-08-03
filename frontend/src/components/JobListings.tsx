import React, { useState } from 'react';
import { Grid, List, ChevronDown } from 'lucide-react';
import JobCard from './JobCard';
import { Job, UserInfo } from '../types';

interface JobListingsProps {
  jobs: Job[];
  userInfo: UserInfo | null;
  onApply: (jobId: string) => void;
  sortBy: string;
  onSortChange: (newSortBy: string) => void;
}

const JobListings: React.FC<JobListingsProps> = ({ jobs, userInfo, onApply, sortBy, onSortChange }) => {
  const [viewMode, setViewMode] = useState('grid');
  const sortOptions = ['Newest First', 'Oldest First', 'Salary High to Low', 'Salary Low to High'];

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{jobs.length} Jobs Found</h2>
          <p className="text-gray-600 mt-1">Based on your search criteria</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className="px-4 py-2 border rounded-lg appearance-none">
              {sortOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {jobs.map((job) => (
          <JobCard 
            key={job._id} 
            job={job} 
            userInfo={userInfo} 
            onApply={onApply} 
          />
        ))}
      </div>
    </div>
  );
};

export default JobListings;