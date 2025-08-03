import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { UserInfo } from '../types';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  userInfo: UserInfo | null;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onSearch, userInfo }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    onNavigate('jobs');
  };

  const navLinkClasses = (page: string) => 
    `font-medium transition-colors ${currentPage === page ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`;

  const handleLogout = () => {
      onNavigate('logout');
  }

  const getInitials = (name: string = ''): string => {
    return name.charAt(0).toUpperCase();
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('jobs')}>
            <h1 className="text-2xl font-bold text-blue-600">
              HireSpark
            </h1>
          </div>

          {/* --- Navigation Bar --- */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate('jobs')} className={navLinkClasses('jobs')}>Jobs</button>
            
            {userInfo && userInfo.role === 'Recruiter' ? (
              <button onClick={() => onNavigate('jobs-posted')} className={navLinkClasses('jobs-posted')}>Jobs Posted</button>
            ) : (
              <button onClick={() => onNavigate('applied-jobs')} className={navLinkClasses('applied-jobs')}>Applied Jobs</button>
            )}

            {userInfo && userInfo.role === 'Recruiter' && (
              <button onClick={() => onNavigate('post-job')} className={navLinkClasses('post-job')}>Post Job</button>
            )}
            
            <button onClick={() => onNavigate('networking')} className={navLinkClasses('networking')}>Networking</button>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-lg mx-8">
          </div>

          <div className="flex items-center space-x-4">
            {userInfo ? (
              <>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Hi, {userInfo.name.split(' ')[0]}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm"
                  >
                    Logout
                  </button>
                  <button onClick={() => onNavigate('profile')} className="flex items-center justify-center w-10 h-10 bg-gray-600 rounded-full text-white font-bold text-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    {getInitials(userInfo.name)}
                  </button>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate('login')} className="font-medium text-gray-700 hover:text-blue-600">Log in</button>
                <button onClick={() => onNavigate('signup')} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">Sign up</button>
              </>
            )}
            <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;