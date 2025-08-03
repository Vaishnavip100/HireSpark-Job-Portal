import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FilterSidebar from './components/FilterSidebar';
import JobListings from './components/JobListings';
import CompanyListings from './components/CompanyListings';
import PostJobForm from './components/PostJobForm';
import NetworkingPage from './components/NetworkingPage';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import CompanyDetailPage from './components/CompanyDetailPage';
import ApplicationPage from './components/ApplicationPage';
import ProfilePage from './components/ProfilePage';
import JobsPostedPage from './components/JobsPostedPage';
import ApplicantsPage from './components/ApplicantsPage';
import AppliedJobsPage from './components/AppliedJobsPage'; // <-- 1. IMPORT THE NEW PAGE
import { FilterState, Job, Company, UserInfo } from './types';

const API_URL = 'http://localhost:5001';

function App() {
  const [currentPage, setCurrentPage] = useState('jobs');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [unfilteredJobs, setUnfilteredJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedJobIdForApply, setSelectedJobIdForApply] = useState<string | null>(null);
  const [selectedJobIdForApplicants, setSelectedJobIdForApplicants] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '', jobTitle: '', location: '', category: '',
    jobTypes: [], locations: [], categories: [],
    salaryRange: 0, experienceRange: 0, sortBy: 'Newest First',
  });
  
  const isInitialMount = useRef(true);

  // useEffect for filtering
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const fetchFilteredJobs = async () => {
      setIsFiltering(true);
      const params = new URLSearchParams({ sortBy: filters.sortBy });
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.jobTitle) params.append('jobTitle', filters.jobTitle);
      if (filters.location) params.append('location', filters.location);
      if (filters.category) params.append('category', filters.category);
      if (filters.jobTypes.length > 0) params.append('jobTypes', filters.jobTypes.join(','));
      if (filters.locations.length > 0) params.append('locations', filters.locations.join(','));
      if (filters.categories.length > 0) params.append('categories', filters.categories.join(','));
      if (filters.salaryRange > 0) params.append('salaryRange', String(filters.salaryRange));
      if (filters.experienceRange > 0) params.append('experienceRange', String(filters.experienceRange));
      try {
        const res = await fetch(`${API_URL}/api/jobs?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch filtered jobs');
        const data = await res.json();
        setFilteredJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsFiltering(false);
      }
    };
    const timerId = setTimeout(fetchFilteredJobs, 500);
    return () => clearTimeout(timerId);
  }, [filters]);

  // useEffect for the initial data load
  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      try {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) setUserInfo(JSON.parse(storedUserInfo));
        const [jobsRes, companiesRes] = await Promise.all([
          fetch(`${API_URL}/api/jobs`),
          fetch(`${API_URL}/api/companies`)
        ]);
        if (!jobsRes.ok || !companiesRes.ok) throw new Error('Network response was not ok.');
        const jobsData = await jobsRes.json();
        const companiesData = await companiesRes.json();
        setUnfilteredJobs(jobsData);
        setFilteredJobs(jobsData);
        setAllCompanies(companiesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load data.');
      } finally {
        setLoading(false);
      }
    };
    initialLoad();
  }, []);

  const handleNavigate = (page: string, data?: any) => {
    if (page === 'logout') {
      localStorage.removeItem('userInfo');
      setUserInfo(null);
      setCurrentPage('jobs');
      return;
    }
    if (page === 'view-applicants' && data?.jobId) setSelectedJobIdForApplicants(data.jobId);
    if (page === 'companyDetail' && data?.companyId) setSelectedCompanyId(data.companyId);
    setCurrentPage(page);
  };

  const handleLoginSuccess = (data: UserInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
    if (selectedJobIdForApply && data.role === 'Job Seeker') {
      setCurrentPage('apply');
    } else {
      setCurrentPage('jobs');
    }
  };

  const handleProfileUpdate = (newUserInfo: UserInfo) => {
    setUserInfo(newUserInfo);
    localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
  };
  
  const handleApplyNow = (jobId: string) => {
    setSelectedJobIdForApply(jobId);
    if (userInfo) {
      setCurrentPage('apply');
    } else {
      setCurrentPage('login');
    }
  };
  
  const handleJobPosted = () => {
    setCurrentPage('jobs');
  };

  const renderCurrentPage = () => {
    if (loading && isInitialMount.current) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

    switch (currentPage) {
      case 'jobs':
        return (
          <>
            <HeroSection onSearch={(sf) => setFilters(prev => ({...filters, ...sf, jobTypes: [], locations: [], categories: [], searchTerm: ''}))} />
            <main className="max-w-7xl mx-auto px-4 py-12">
              <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-80 flex-shrink-0">
                  <FilterSidebar filters={filters} onFiltersChange={setFilters} allJobs={unfilteredJobs} />
                </aside>
                <div className="flex-1">
                  {isFiltering ? <div className="text-center py-10">Searching...</div> : (
                    <JobListings
                      jobs={filteredJobs}
                      userInfo={userInfo}
                      onApply={handleApplyNow}
                      sortBy={filters.sortBy}
                      onSortChange={(newSortBy) => setFilters(prev => ({ ...prev, sortBy: newSortBy }))}
                    />
                  )}
                </div>
              </div>
            </main>
          </>
        );
      case 'apply':
        if (!userInfo || !selectedJobIdForApply) { handleNavigate('login'); return null; }
        return <main><ApplicationPage jobId={selectedJobIdForApply} userInfo={userInfo} onApplicationSuccess={() => handleNavigate('jobs')} /></main>;
      case 'profile':
        if (!userInfo) { handleNavigate('login'); return null; }
        return <main><ProfilePage userInfo={userInfo} onProfileUpdate={handleProfileUpdate} /></main>;
      case 'post-job':
        if (userInfo && userInfo.role === 'Recruiter') { return <main><PostJobForm onJobPosted={handleJobPosted} /></main>; }
        alert('You must be a Recruiter to post a job.'); handleNavigate('jobs'); return null;
      case 'jobs-posted':
        if (userInfo && userInfo.role === 'Recruiter') { return <main><JobsPostedPage userInfo={userInfo} onNavigate={handleNavigate} /></main>; }
        alert('You must be a Recruiter to view this page.'); handleNavigate('jobs'); return null;
      case 'view-applicants':
        if (userInfo && userInfo.role === 'Recruiter' && selectedJobIdForApplicants) { return <main><ApplicantsPage jobId={selectedJobIdForApplicants} userInfo={userInfo} /></main>; }
        handleNavigate('jobs'); return null;
      
      // --- 2. ADD THIS CASE TO FIX THE "PAGE NOT FOUND" ERROR ---
      case 'applied-jobs':
        if (!userInfo) { 
          // If the user is not logged in, redirect them to the login page
          handleNavigate('login'); 
          return null; 
        }
        // If logged in, show the AppliedJobsPage
        return <main><AppliedJobsPage userInfo={userInfo} /></main>;

      case 'login':
        return <main className="max-w-7xl mx-auto py-12"><LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} /></main>;
      case 'signup':
        return <main className="max-w-7xl mx-auto py-12"><SignupPage onSignupSuccess={handleLoginSuccess} onNavigate={handleNavigate} /></main>;
      case 'companies':
        return <main><CompanyListings companies={allCompanies} onSelectCompany={(id) => handleNavigate('companyDetail', { companyId: id })} /></main>;
      case 'companyDetail':
        return <main>{selectedCompanyId ? <CompanyDetailPage companyId={selectedCompanyId} /> : <div>No Company Selected</div>}</main>;
      case 'networking':
        return <main><NetworkingPage userInfo={userInfo} onNavigate={handleNavigate} /></main>;
      default:
        return <div className="text-center py-12">Page Not Found</div>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onSearch={(query) => setFilters({ ...filters, searchTerm: query, jobTitle: '', location: '', category: '' })}
        userInfo={userInfo}
      />
      {renderCurrentPage()}
      <Footer />
    </div>
  );
}

export default App;