import React, { useState } from 'react';
import { UserInfo } from '../types';

const API_URL = 'https://hirespark-job-portal-backend.onrender.com';

interface LoginPageProps {
  onLoginSuccess: (data: UserInfo) => void;
  onNavigate: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to log in.');
      }
    
      onLoginSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input id="email-address" name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="Email address" className="w-full px-3 py-2 border rounded-t-md" />
            </div>
            <div>
              <input id="password" name="password" type="password" required value={formData.password} onChange={handleInputChange} placeholder="Password" className="w-full px-3 py-2 border rounded-b-md" />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center mt-4">
          <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer" onClick={() => onNavigate('signup')}>
            Don't have an account? Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
