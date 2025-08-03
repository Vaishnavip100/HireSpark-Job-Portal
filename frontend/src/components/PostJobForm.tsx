import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, FileText, Tag } from 'lucide-react';
import { ethers } from 'ethers';

const ADMIN_WALLET_ADDRESS = "0x81D2a86D1e9aE130DAaED20bfEDB2527941E9E59"; 
const JOB_POST_FEE = "0.001"; // The fee in Sepolia ETH
const API_URL = 'https://hirespark-job-portal-backend.onrender.com';

interface PostJobFormProps {
  onJobPosted: () => void;
}

const PostJobForm: React.FC<PostJobFormProps> = ({ onJobPosted }) => {
  const [formData, setFormData] = useState({
    title: '', company: '', description: '', location: '', type: 'Full-time',
    category: '', salaryMin: '', salaryMax: '', experience: '', skills: '', requirements: ''
  });
  
  // State for Web3 integration
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Please connect your wallet to post a job.');

  const connectWallet = async () => {
    if (!window.ethereum) return alert('MetaMask is not installed. Please install it to continue.');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      setWalletConnected(true);
      setStatusMessage('Wallet connected. Please fill out the job details.');
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!window.ethereum) throw new Error("MetaMask is not available.");
      setStatusMessage('Please approve the transaction in your MetaMask wallet...');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: ADMIN_WALLET_ADDRESS,
        value: ethers.parseEther(JOB_POST_FEE)
      });
      setStatusMessage(`Transaction sent (${tx.hash.substring(0,10)}...). Waiting for confirmation...`);
      await tx.wait(); 
      
      const transactionHash = tx.hash;
      setStatusMessage('Payment confirmed! Posting job to our server...');

      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (!userInfo.token) throw new Error("Authentication error.");

      const res = await fetch(`${API_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
        body: JSON.stringify({ ...formData, transactionHash: transactionHash })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to post job.');

      alert('Job posted successfully!');
      onJobPosted();

    } catch (err) {
      const errorMessage = err instanceof Error ? (err as any).reason || err.message : 'An unknown error occurred.';
      setError(`Operation failed: ${errorMessage}`);
      setStatusMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h2>
          <p className="text-gray-600">{statusMessage}</p>
        </div>

        {!walletConnected ? (
          <div className="text-center py-8">
            <button onClick={connectWallet} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg">
              Connect MetaMask Wallet
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"><Briefcase className="inline h-4 w-4 mr-2" />Job Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Senior Frontend Developer" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} required placeholder="e.g. TechCorp" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="inline h-4 w-4 mr-2" />Location *</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Bangalore, Remote" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><Clock className="inline h-4 w-4 mr-2" />Job Type *</label>
                <select name="type" value={formData.type} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white">
                  <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><Tag className="inline h-4 w-4 mr-2" />Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white">
                  <option value="">Select Category</option><option>Technology</option><option>Design</option><option>Marketing</option><option>Sales</option><option>Finance</option><option>Human Resources</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Required (years)</label>
                <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 3" min="0" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"><DollarSign className="inline h-4 w-4 mr-2" />Salary Range (LPA)</label>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} placeholder="Min (e.g. 15)" className="px-4 py-3 border border-gray-300 rounded-lg" />
                <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} placeholder="Max (e.g. 25)" className="px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. React, TypeScript, Node.js (comma separated)" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"><FileText className="inline h-4 w-4 mr-2" />Job Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={6} placeholder="Describe the role, responsibilities..." className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Requirements</label>
              <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={4} placeholder="Any additional requirements or benefits..." className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>
            
            {error && <p className="text-red-500 text-center">{error}</p>}
            
            <div className="flex justify-end space-x-4 pt-6">
              <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:bg-gray-400">
                {loading ? 'Processing...' : `Pay ${JOB_POST_FEE} ETH & Post Job`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PostJobForm;
