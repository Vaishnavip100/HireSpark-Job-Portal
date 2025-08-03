import React, { useState } from 'react';
import { UserInfo } from '../types';

const API_URL = 'http://localhost:5001';

interface SignupPageProps {
  onSignupSuccess: (data: UserInfo) => void;
  onNavigate: (page: string) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Job Seeker',
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to sign up.');
      }
      
      onSignupSuccess(data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div><h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2></div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Form inputs for name, email, password, confirmPassword */}
          <div className="rounded-md shadow-sm -space-y-px">
            <input name="name" type="text" required value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="w-full px-3 py-2 border rounded-t-md"/>
            <input name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="Email address" className="w-full px-3 py-2 border"/>
            <input name="password" type="password" required value={formData.password} onChange={handleInputChange} placeholder="Password" className="w-full px-3 py-2 border"/>
            <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm Password" className="w-full px-3 py-2 border rounded-b-md"/>
          </div>
          
          {/* Role selector */}
          <div className="pt-4">
            <h3 className="mb-3 font-semibold">I am a:</h3>
            <ul className="items-center w-full text-sm font-medium bg-white border rounded-lg sm:flex">
              <li className="w-full border-b sm:border-b-0 sm:border-r"><div className="flex items-center pl-3"><input id="role-job-seeker" type="radio" value="Job Seeker" name="role" checked={formData.role === 'Job Seeker'} onChange={handleInputChange} /><label htmlFor="role-job-seeker" className="w-full py-3 ml-2">Job Seeker</label></div></li>
              <li className="w-full"><div className="flex items-center pl-3"><input id="role-recruiter" type="radio" value="Recruiter" name="role" checked={formData.role === 'Recruiter'} onChange={handleInputChange} /><label htmlFor="role-recruiter" className="w-full py-3 ml-2">Recruiter</label></div></li>
            </ul>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          
          <div><button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">{loading ? 'Signing Up...' : 'Sign up'}</button></div>
        </form>
        <div className="text-sm text-center mt-4"><span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer" onClick={() => onNavigate('login')}>Already have an account? Log in</span></div>
      </div>
    </div>
  );
};

export default SignupPage;