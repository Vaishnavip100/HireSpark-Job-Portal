import React, {useState } from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribing email:', email);
    alert('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Column 1: Branding and Social Links */}
          <div>
            <h3 className="text-3xl font-bold text-blue-400 mb-4">HireSpark Jobs</h3>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-lg">
              Our mission is to bridge the gap between innovative companies and the next generation talent. Your future starts with the right connection.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-700 rounded-lg hover:bg-blue-600"><Facebook size={20} /></a>
              <a href="#" className="p-2 bg-gray-700 rounded-lg hover:bg-blue-600"><Twitter size={20} /></a>
              <a href="#" className="p-2 bg-gray-700 rounded-lg hover:bg-blue-600"><Linkedin size={20} /></a>
              <a href="#" className="p-2 bg-gray-700 rounded-lg hover:bg-blue-600"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Column 2: Newsletter Signup */}
          <div className="bg-gray-700 p-8 rounded-lg">
            <h4 className="text-xl font-semibold mb-4 tracking-wide">Stay Ahead of the Curve</h4>
            <p className="text-gray-300 mb-5">
              Subscribe to our weekly newsletter for the latest job openings, career tips, and industry insights.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Your email address" 
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white" 
                required 
              />
              <button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* --- Bottom Section--- */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start"><Mail size={18} className="mr-3 text-blue-400" /><span>contact@hirespark.dev</span></div>
            <div className="flex items-center justify-center md:justify-start"><Phone size={18} className="mr-3 text-blue-400" /><span>+91 9xxxx xxxxx</span></div>
            <div className="flex items-center justify-center md:justify-start"><MapPin size={18} className="mr-3 text-blue-400" /><span>Secunderabad, Telangana, India</span></div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} HireSpark. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-400">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
