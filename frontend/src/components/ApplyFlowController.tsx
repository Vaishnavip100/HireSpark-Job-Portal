import React, { useState, useEffect } from 'react';
import JobListings from './JobListings';
import ApplicationModal from './ApplicationModal';
import LoginPage from './LoginPage';
import { Job, UserInfo } from '../types';

interface ApplyFlowControllerProps {
  jobs: Job[];
  userInfo: UserInfo | null;
  onLoginSuccess: (data: UserInfo) => void;
  onNavigate: (page: string) => void;
  sortBy: string;
  onSortChange: (newSortBy: string) => void;
}

const ApplyFlowController: React.FC<ApplyFlowControllerProps> = ({ 
  jobs, userInfo, onLoginSuccess, onNavigate, sortBy, onSortChange 
}) => {
  
  const [isApplicationModalOpen, setApplicationModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // The main handler function for the "Apply Now" click
  const handleApply = (jobId: string) => {
    setSelectedJobId(jobId); 
    if (userInfo) {
      // If user is logged in, open the application form
      setApplicationModalOpen(true);
    } else {
      // If not, open the login form/modal
      setLoginModalOpen(true);
    }
  };

  const handleInternalLoginSuccess = (data: UserInfo) => {
    onLoginSuccess(data); 
    setLoginModalOpen(false); 
    setApplicationModalOpen(true); 
  };

  return (
    <>
      <JobListings
        jobs={jobs}
        onApply={handleApply}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />

      {isLoginModalOpen && (
        <LoginPage 
          onLoginSuccess={handleInternalLoginSuccess}
          onNavigate={onNavigate} 
          isModal={true} 
          onClose={() => setLoginModalOpen(false)} 
        />
      )}

      {isApplicationModalOpen && selectedJobId && (
        <ApplicationModal
          jobId={selectedJobId}
          onClose={() => {
            setApplicationModalOpen(false);
            setSelectedJobId(null);
          }}
        />
      )}
    </>
  );
};

export default ApplyFlowController;