import React, { useState } from 'react';
import { Grid, List, ChevronDown } from 'lucide-react';
import CompanyCard from './CompanyCard';
import { Company } from '../types';

interface CompanyListingsProps {
  companies: Company[];
}

const CompanyListings: React.FC<CompanyListingsProps> = ({ companies }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('Name A-Z');

  const sortCompanies = (companies: Company[], sortBy: string): Company[] => {
    const sortedCompanies = [...companies];
    
    switch (sortBy) {
      case 'Name A-Z':
        return sortedCompanies.sort((a, b) => a.name.localeCompare(b.name));
      case 'Name Z-A':
        return sortedCompanies.sort((a, b) => b.name.localeCompare(a.name));
      case 'Most Jobs':
        return sortedCompanies.sort((a, b) => b.openPositions - a.openPositions);
      case 'Least Jobs':
        return sortedCompanies.sort((a, b) => a.openPositions - b.openPositions);
      default:
        return sortedCompanies;
    }
  };

  const sortOptions = ['Name A-Z', 'Name Z-A', 'Most Jobs', 'Least Jobs'];
  const sortedCompanies = sortCompanies(companies, sortBy);

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{sortedCompanies.length} Companies Found</h2>
          <p className="text-gray-600 mt-1">Discover amazing companies to work with</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer pr-8"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-blue-600'} transition-colors rounded-l-lg`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-blue-600'} transition-colors rounded-r-lg`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Company Cards */}
      <div className="space-y-6">
        {sortedCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
      
      {sortedCompanies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No companies found matching your criteria.</p>
          <p className="text-gray-400 mt-2">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyListings;