import React from 'react';
import { MapPin, Users, Briefcase } from 'lucide-react';
import { Company } from '../types';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4 mb-4">
        {/* Company Logo */}
        <div className="bg-blue-500 p-3 rounded-lg flex-shrink-0">
          <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
            <span className="text-blue-500 font-bold text-lg">{company.logo}</span>
          </div>
        </div>
        
        {/* Company Details */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{company.name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{company.description}</p>
          
          {/* Company Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{company.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{company.employees} employees</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              <span>{company.industry}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-blue-600 font-semibold">
          {company.openPositions} Open Positions
        </div>
        
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          View Company
        </button>
      </div>
    </div>
  );
};

export default CompanyCard;