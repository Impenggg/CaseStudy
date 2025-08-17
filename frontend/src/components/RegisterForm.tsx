import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  // Form validation
  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (formData.name.length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(formData.email, formData.password, formData.name);
      if (success) {
        const fromState = (location.state as any)?.from?.pathname
        const intended = sessionStorage.getItem('intended_path') || undefined
        const to = fromState || intended || '/'
        sessionStorage.removeItem('intended_path')
        navigate(to, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-cordillera-olive flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-light text-cordillera-cream tracking-wide mb-2">
            Cordillera Weaving
          </h1>
          <h2 className="text-2xl font-light text-cordillera-cream/90 mb-8">
            Join Our Community
          </h2>
        </div>

        <div className="bg-cordillera-cream/10 backdrop-blur-sm border border-cordillera-gold/30 p-8">
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-cordillera-cream font-light mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cordillera-cream/20 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/50 focus:outline-none focus:border-cordillera-gold focus:bg-cordillera-cream/30 transition-all duration-200"
                placeholder="Enter your full name"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-cordillera-cream font-light mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cordillera-cream/20 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/50 focus:outline-none focus:border-cordillera-gold focus:bg-cordillera-cream/30 transition-all duration-200"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-cordillera-cream font-light mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cordillera-cream/20 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/50 focus:outline-none focus:border-cordillera-gold focus:bg-cordillera-cream/30 transition-all duration-200"
                placeholder="Create a password (min. 8 characters)"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-cordillera-cream font-light mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cordillera-cream/20 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/50 focus:outline-none focus:border-cordillera-gold focus:bg-cordillera-cream/30 transition-all duration-200"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cordillera-gold text-cordillera-olive py-3 px-4 font-medium tracking-wide hover:bg-cordillera-gold/90 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:ring-offset-2 focus:ring-offset-cordillera-olive transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cordillera-olive" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-cordillera-cream/70 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-cordillera-gold hover:text-cordillera-gold/80 font-medium transition-colors"
                disabled={isLoading}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
