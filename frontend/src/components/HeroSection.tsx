import React, { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (filters: { jobTitle: string; location: string; category: string }) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Technology',
    'Design',
    'Marketing',
    'Sales',
    'Finance',
    'Operations',
    'Human Resources',
    'Data Science'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      jobTitle,
      location,
      category: selectedCategory
    });
  };

  return (
    <section className="bg-gradient-to-br from-blue-500 to-blue-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Find Your Dream Job
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto">
          Discover opportunities from top companies and connect with your future career
        </p>

        <div className="bg-white rounded-xl p-6 shadow-2xl max-w-5xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job title or keyword"
                className="w-full pl-10 pr-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full pl-10 pr-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="">Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>

            <button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Search Jobs
            </button>
          </form>
        </div>

        
      </div>
    </section>
  );
};

export default HeroSection;