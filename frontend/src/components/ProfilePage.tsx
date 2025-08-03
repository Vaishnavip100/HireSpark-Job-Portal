import React, { useState, useEffect } from 'react';
import { UserInfo } from '../types';
import { ethers } from 'ethers';
import { Edit, Save, XCircle } from 'lucide-react'; 

const API_URL = 'https://hirespark-job-portal-backend.onrender.com';

interface ProfilePageProps {
  userInfo: UserInfo;
  onProfileUpdate: (newUserInfo: UserInfo) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userInfo, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '', bio: '', linkedinUrl: '', skills: '', walletAddress: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This useEffect fetches the profile data when the component loads.
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${userInfo.token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          linkedinUrl: data.linkedinUrl || '',
          skills: (data.skills || []).join(', '),
          walletAddress: data.walletAddress || ''
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userInfo.token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask to use this feature.');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setFormData(prev => ({ ...prev, walletAddress: address }));
      alert(`Wallet connected successfully: ${address}`);
    } catch (err) {
      console.error(err);
      setError('Failed to connect wallet.');
    }
  };

  const handleAISkillExtract = async () => {
    if (!formData.bio) return alert("Please write a bio first to extract skills from.");
    try {
        const res = await fetch(`${API_URL}/api/users/extract-skills`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
            body: JSON.stringify({ text: formData.bio })
        });
        const skills = await res.json();
        if (!res.ok) throw new Error('Failed to extract skills.');
        setFormData(prev => ({ ...prev, skills: skills.join(', ') }));
        alert("Skills extracted from bio!");
    } catch (err) {
        alert(err instanceof Error ? err.message : 'AI extraction failed.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onProfileUpdate(data);
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !formData.name) return <div>Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md">
        
        {/* --- DYNAMIC HEADER AND EDIT/CANCEL BUTTON --- */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Your Profile' : 'Your Profile'}
          </h1>
          {isEditing ? (
            <button onClick={() => setIsEditing(false)} className="flex items-center text-gray-500 hover:text-gray-800 font-medium">
              <XCircle size={20} className="mr-2" /> Cancel
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg">
              <Edit size={16} className="mr-2" /> Edit Profile
            </button>
          )}
        </div>

        {/* --- CONDITIONAL RENDERING LOGIC --- */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
              <input id="linkedinUrl" name="linkedinUrl" type="url" value={formData.linkedinUrl} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Your Bio</label>
              <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
              <button type="button" onClick={handleAISkillExtract} className="mt-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md">
                ✨ AI Extract Skills from Bio
              </button>
            </div>
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Your Skills (comma-separated)</label>
              <input id="skills" name="skills" type="text" value={formData.skills} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Wallet Address</label>
              <div className="mt-1 flex rounded-md">
                <input type="text" value={formData.walletAddress} readOnly placeholder="Not connected" className="flex-1 w-full px-3 py-2 border rounded-l-md bg-gray-100" />
                <button type="button" onClick={connectWallet} className="inline-flex items-center px-4 border rounded-r-md bg-gray-50 hover:bg-gray-100">
                  {formData.walletAddress ? 'Change' : 'Connect'}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3 px-4 rounded-md text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
              <Save size={20} className="mr-2" />
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

        ) : (

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <p className="mt-1 text-lg text-gray-900">{formData.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">LinkedIn URL</h3>
              <p className="mt-1 text-lg text-blue-600 hover:underline break-words"><a href={formData.linkedinUrl} target="_blank" rel="noopener noreferrer">{formData.linkedinUrl || 'Not provided'}</a></p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Bio</h3>
              <p className="mt-1 text-lg text-gray-900 whitespace-pre-wrap">{formData.bio || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Skills</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s).map(skill => (
                  <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">{skill}</span>
                )) : <p className="text-gray-900">No skills listed.</p>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Wallet Address</h3>
              <p className="mt-1 text-lg text-gray-900 break-all">{formData.walletAddress || 'Not connected'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
