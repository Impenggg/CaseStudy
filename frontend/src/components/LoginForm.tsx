import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });
  const [error, setError] = React.useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const fromState = (location.state as any)?.from?.pathname
  const intended = sessionStorage.getItem('intended_path') || undefined
  const from = fromState || intended || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        // clear intended path after successful navigation
        sessionStorage.removeItem('intended_path');
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-heritage-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-light text-heritage-100 tracking-wide mb-2">
            Cordillera Weaving
          </h1>
          <h2 className="text-2xl font-light text-heritage-100/90 mb-8">
            Welcome Back
          </h2>
        </div>

        <div className="bg-heritage-100/10 backdrop-blur-sm border border-heritage-500/30 p-8">
          {error && (
            <div className="mb-6 bg-error/20 border border-error/50 text-error-light px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-heritage-100 font-light mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-heritage-100/20 border border-heritage-500/30 text-heritage-100 placeholder-heritage-100/50 focus:outline-none focus:border-heritage-500 focus:bg-heritage-100/30 transition-all duration-200"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-heritage-100 font-light mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-heritage-100/20 border border-heritage-500/30 text-heritage-100 placeholder-heritage-100/50 focus:outline-none focus:border-heritage-500 focus:bg-heritage-100/30 transition-all duration-200"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-heritage-500 text-heritage-800 py-3 px-4 font-medium tracking-wide hover:bg-heritage-500/90 focus:outline-none focus:ring-2 focus:ring-heritage-500 focus:ring-offset-2 focus:ring-offset-heritage-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-heritage-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-heritage-100/70 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-heritage-500 hover:text-heritage-500/80 font-medium transition-colors"
                disabled={isLoading}
              >
                Join our community
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
