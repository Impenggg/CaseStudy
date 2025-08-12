import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password. Try: maria@example.com / password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo accounts for easy testing
  const demoAccounts = [
    { email: 'maria@example.com', role: 'artisan', name: 'Maria Santos' },
    { email: 'juan@example.com', role: 'artisan', name: 'Juan Dela Cruz' },
    { email: 'sarah@example.com', role: 'customer', name: 'Sarah Johnson' }
  ];

  const loginWithDemo = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
    setError('');
    setIsLoading(true);

    try {
      const success = await login(demoEmail, 'password');
      if (success) {
        navigate('/');
      }
    } catch (err) {
      setError('Demo login failed.');
    } finally {
      setIsLoading(false);
    }
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
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-cordillera-cream/70">
            Sign in to your account to continue your journey
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/50 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-light text-cordillera-cream mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/50 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                placeholder="Enter your password"
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-cordillera-cream/70">
              Don't have an account?{' '}
              <Link to="/register" className="text-cordillera-gold hover:text-cordillera-gold/80 font-medium">
                Join our community
              </Link>
            </p>
          </div>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8 pt-6 border-t border-cordillera-gold/20">
          <p className="text-sm text-cordillera-cream/70 text-center mb-4">
            Quick Demo Login (password: "password")
          </p>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => loginWithDemo(account.email)}
                disabled={isLoading}
                className="w-full text-left px-4 py-2 bg-cordillera-cream/5 hover:bg-cordillera-cream/10 border border-cordillera-gold/20 text-cordillera-cream/90 text-sm transition-colors disabled:opacity-50"
              >
                <div className="flex justify-between">
                  <span>{account.name}</span>
                  <span className="text-cordillera-gold text-xs capitalize">{account.role}</span>
                </div>
                <div className="text-cordillera-cream/60 text-xs">{account.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};