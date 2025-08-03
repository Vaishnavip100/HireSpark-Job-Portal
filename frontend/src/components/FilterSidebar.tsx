import React, { useMemo } from 'react';
import { Search, MapPin, Briefcase, Tag, DollarSign, Clock } from 'lucide-react';
import { FilterState, Job } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  allJobs: Job[]; 
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFiltersChange, allJobs }) => {
  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const handleCheckboxChange = (type: 'jobTypes' | 'locations' | 'categories', value: string) => {
    const currentArray = filters[type];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters({ [type]: newArray });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchTerm: '',
      jobTitle: '',
      location: '',
      category: '',
      jobTypes: [],
      locations: [],
      categories: [],
      salaryRange: 0,
      experienceRange: 0,
      sortBy: 'Newest First',
    });
  };

  // --- DYNAMIC COUNTING LOGIC ---
  const dynamicCounts = useMemo(() => {
    const locationCounts: { [key: string]: number } = {};
    const jobTypeCounts: { [key: string]: number } = {};
    const categoryCounts: { [key: string]: number } = {};

    for (const job of allJobs) {
      // Count Job Types
      jobTypeCounts[job.type] = (jobTypeCounts[job.type] || 0) + 1;
      
      // Count Categories
      categoryCounts[job.category] = (categoryCounts[job.category] || 0) + 1;

      // Count Locations (handle 'Work from home' via the 'remote' flag)
      if (job.remote) {
        locationCounts['Work from home'] = (locationCounts['Work from home'] || 0) + 1;
      }
      if (job.location && !job.remote) {
         locationCounts[job.location] = (locationCounts[job.location] || 0) + 1;
      }
    }
    return { locationCounts, jobTypeCounts, categoryCounts };
  }, [allJobs]);

  // --- STATIC, PREDEFINED FILTER OPTIONS ---
  const locations = ['Work from home', 'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const categories = ['Technology', 'Design', 'Marketing', 'Sales', 'Finance', 'Human Resources'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
      {/* Filter Header and Search are unchanged */}
      <div className="flex items-center mb-6">{/* ... */}</div>
      <div className="mb-8">{/* ... */}</div>

      {/* --- FILTER SECTIONS with DYNAMIC COUNTS --- */}

      {/* Location Filter */}
      <div className="mb-8">
        <div className="flex items-center mb-4"><MapPin className="h-4 w-4 text-gray-600 mr-2" /><h3 className="text-sm font-medium text-gray-900">Location</h3></div>
        <div className="space-y-3">
          {locations.map((location) => {
            const count = dynamicCounts.locationCounts[location] || 0;
            if (count === 0) return null; 
            return (
              <label key={location} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <input type="checkbox" checked={filters.locations.includes(location)} onChange={() => handleCheckboxChange('locations', location)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-3 text-sm text-gray-700">{location}</span>
                </div>
                {/* Display the dynamically calculated count */}
                <span className="text-sm text-gray-500">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Job Type Filter */}
      <div className="mb-8">
        <div className="flex items-center mb-4"><Briefcase className="h-4 w-4 text-gray-600 mr-2" /><h3 className="text-sm font-medium text-gray-900">Job Type</h3></div>
        <div className="space-y-3">
          {jobTypes.map((type) => {
            const count = dynamicCounts.jobTypeCounts[type] || 0;
            if (count === 0) return null;
            return (
              <label key={type} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <input type="checkbox" checked={filters.jobTypes.includes(type)} onChange={() => handleCheckboxChange('jobTypes', type)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-3 text-sm text-gray-700">{type}</span>
                </div>
                <span className="text-sm text-gray-500">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex items-center mb-4"><Tag className="h-4 w-4 text-gray-600 mr-2" /><h3 className="text-sm font-medium text-gray-900">Category</h3></div>
        <div className="space-y-3">
          {categories.map((category) => {
            const count = dynamicCounts.categoryCounts[category] || 0;
            if (count === 0) return null;
            return (
              <label key={category} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <input type="checkbox" checked={filters.categories.includes(category)} onChange={() => handleCheckboxChange('categories', category)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-3 text-sm text-gray-700">{category}</span>
                </div>
                <span className="text-sm text-gray-500">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Salary Range */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <DollarSign className="h-4 w-4 text-gray-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Annual Salary (in lakhs)</h3>
        </div>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="100"
            value={filters.salaryRange}
            onChange={(e) => updateFilters({ salaryRange: parseInt(e.target.value) })}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>0</span>
            <span>50</span>
            <span>100+</span>
          </div>
          <p className="text-center text-sm font-medium text-gray-900 mt-2">₹{filters.salaryRange} LPA+</p>
        </div>
      </div>

      {/* Experience Range */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Clock className="h-4 w-4 text-gray-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Years of Experience</h3>
        </div>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="15"
            value={filters.experienceRange}
            onChange={(e) => updateFilters({ experienceRange: parseInt(e.target.value) })}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>0</span>
            <span>7</span>
            <span>15+</span>
          </div>
          <p className="text-center text-sm font-medium text-gray-900 mt-2">{filters.experienceRange} years+</p>
        </div>
      </div>

      {/* Clear Filters */}
      <button 
        onClick={clearAllFilters}
        className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;