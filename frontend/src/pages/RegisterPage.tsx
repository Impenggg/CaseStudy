import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as 'customer' | 'artisan'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(formData.name, formData.email, formData.password, formData.role);
      if (success) {
        navigate('/');
      } else {
        setError('Registration failed. Email may already be in use.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-cordillera-olive flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="text-4xl font-serif font-light text-cordillera-cream tracking-wide">
            Cordillera Weaving
          </Link>
          <h2 className="mt-6 text-3xl font-serif font-light text-cordillera-cream">
            Join Our Community
          </h2>
          <p className="mt-2 text-sm text-cordillera-cream/70">
            Create your account to start your Cordillera journey
          </p>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-light text-cordillera-cream mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/50 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-light text-cordillera-cream mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/50 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-light text-cordillera-cream mb-2">
                I am a...
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
              >
                <option value="customer">Customer (I want to buy and support artisans)</option>
                <option value="artisan">Artisan (I create and sell traditional crafts)</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-light text-cordillera-cream mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/50 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                placeholder="Create a password (min 6 characters)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-light text-cordillera-cream mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/50 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cordillera-gold text-cordillera-olive py-3 px-4 font-medium tracking-wide hover:bg-cordillera-gold/90 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:ring-offset-2 focus:ring-offset-cordillera-olive transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-cordillera-cream/70">
              Already have an account?{' '}
              <Link to="/login" className="text-cordillera-gold hover:text-cordillera-gold/80 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </form>

        {/* Role Information */}
        <div className="mt-8 pt-6 border-t border-cordillera-gold/20">
          <div className="text-sm text-cordillera-cream/70 space-y-2">
            <p className="font-medium text-cordillera-cream">Join as:</p>
            <div className="space-y-1">
              <p><span className="text-cordillera-gold">Customer:</span> Browse, purchase, and support traditional artisans</p>
              <p><span className="text-cordillera-gold">Artisan:</span> Showcase and sell your handcrafted creations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};