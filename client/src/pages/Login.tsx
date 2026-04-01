import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { token, ...user } = response.data;
      setAuth(user, token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-400 to-blue-600 p-3 sm:p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          {/* Enhanced Logo Section */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative group">
              {/* Animated background glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl opacity-75 blur group-hover:opacity-100 transition duration-300"></div>
              
              {/* Logo container */}
              <div className="relative bg-white p-4 sm:p-6 rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:scale-105">
                <img 
                  src="/assets/regent-logo.jpg" 
                  alt="Regent University Logo"
                  className="h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 object-contain drop-shadow-lg"
                  onError={(e) => {
                    // Fallback to icon if logo not available
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <div className="hidden bg-gradient-to-br from-blue-600 to-blue-700 p-4 sm:p-6 rounded-xl shadow-inner">
                  <FileText className="h-16 w-16 sm:h-20 sm:w-20 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          {/* University branding */}
          <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent mb-2 leading-tight">
              Regent University College of<br />Science and Technology
            </h1>
            <div className="h-0.5 sm:h-1 w-20 sm:w-24 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full mb-2 sm:mb-3"></div>
            <p className="text-gray-700 font-medium text-base sm:text-lg">Document Management System</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Secure • Organized • Accessible</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Welcome Back</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Sign in to access your documents</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@regent.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="text-sm"
                />
              </div>

              <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Enhanced Developer Credit */}
        <div className="mt-8 text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-blue-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Developer</span>
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </div>
            <p className="text-base font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 bg-clip-text text-transparent">
              Prepared by David Selorm Gabion
            </p>
            <p className="text-sm text-gray-600 font-medium mt-1">
              © 2026 All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
