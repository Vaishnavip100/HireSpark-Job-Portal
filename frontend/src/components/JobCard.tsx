import React from 'react';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { Job, UserInfo } from '../types';

interface JobCardProps {
  job: Job;
  userInfo: UserInfo | null;
  onApply: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, userInfo, onApply }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-500 p-3 rounded-lg">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-blue-500 font-bold text-sm">{job.company.charAt(0)}</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
            <p className="text-gray-600 font-medium mb-3">{job.company}</p>
            <p className="text-gray-700 text-sm mb-4">{job.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {(job.skills || []).slice(0, 3).map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">{skill}</span>
              ))}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center"><MapPin size={16} className="mr-1" /><span>{job.location}</span></div>
              <div className="flex items-center"><Clock size={16} className="mr-1" /><span>{job.type}</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-4">
          <span className="text-blue-600 font-semibold text-lg">{job.salary}</span>
          <div className="flex items-center text-sm text-gray-500"><Calendar size={16} className="mr-1" /><span>Posted {new Date(job.createdAt).toLocaleDateString()}</span></div>
        </div>
        
        {/* --- ROLE-BASED UI CHANGE --- */}
        {userInfo && userInfo.role === 'Job Seeker' && (
          <button 
            onClick={() => onApply(job._id)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;