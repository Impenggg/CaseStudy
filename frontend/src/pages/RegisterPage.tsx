import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

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

    // Normalize inputs
    const email = formData.email.trim().toLowerCase();
    const name = formData.name.trim();
    const role = formData.role === 'customer' ? 'customer' : 'artisan';

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Correct parameter order: (email, password, name, role)
      const success = await register(email, formData.password, name, role);
      if (success) {
        // Redirect to role dashboard by normalized role in localStorage
        const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        let normalizedRole: string | undefined;
        try {
          normalizedRole = stored ? (JSON.parse(stored)?.role as string | undefined) : undefined;
        } catch {}
        const dash = normalizedRole === 'artisan' ? '/dashboard/artisan' : '/dashboard/customer';
        navigate(dash, { replace: true });
      } else {
        setError('Registration failed. Email may already be in use.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
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
    <div className="relative min-h-screen bg-cordillera-olive py-10 sm:py-12">
      {/* Background gradient + woven pattern */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
        <svg className="absolute -top-10 -left-10 w-[500px] h-[500px] opacity-[0.06]" viewBox="0 0 200 200" aria-hidden>
          <defs>
            <pattern id="weave-register-a" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="20" height="20" fill="none" />
              <path d="M0 10 H20 M10 0 V20" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#weave-register-a)" />
        </svg>
        <svg className="absolute bottom-0 right-0 w-[600px] h-[600px] opacity-[0.05] rotate-12" viewBox="0 0 200 200" aria-hidden>
          <defs>
            <pattern id="weave-register-b" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="20" height="20" fill="none" />
              <path d="M0 10 H20 M10 0 V20" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#weave-register-b)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Hero panel */}
          <div className="hidden lg:flex relative overflow-hidden rounded-md border border-cordillera-gold/20 bg-cordillera-cream/5">
            <div className="absolute inset-0 bg-gradient-to-br from-cordillera-gold/10 via-transparent to-cordillera-gold/10" />
            <div className="relative z-10 p-10 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-serif text-cordillera-cream">Welcome to the Community</h1>
                <p className="mt-4 text-cordillera-cream/80 leading-relaxed max-w-md">
                  Create an account to support artisans, collect stories, and be part of preserving Cordillera heritage.
                </p>
              </div>
              <ul className="mt-10 space-y-3 text-cordillera-cream/80 text-sm">
                <li className="flex items-center"><span className="mr-2 text-cordillera-gold">•</span> Discover artisan-made crafts</li>
                <li className="flex items-center"><span className="mr-2 text-cordillera-gold">•</span> Save and share inspiring stories</li>
                <li className="flex items-center"><span className="mr-2 text-cordillera-gold">•</span> Support community campaigns</li>
              </ul>
            </div>
          </div>

          {/* Form card */}
          <div className="relative">
            <Card className="mx-auto max-w-md w-full">
              <CardContent className="space-y-8">
              {/* Header */}
              <div className="text-center">
                <Link to="/" className="text-3xl sm:text-4xl font-serif font-light text-cordillera-cream tracking-wide">
                  Cordillera Weaving
                </Link>
                <h2 className="mt-4 text-2xl sm:text-3xl font-serif font-light text-cordillera-cream">
                  Create your account
                </h2>
                <p className="mt-2 text-sm text-cordillera-cream/70">
                  Join in a few steps to start your journey
                </p>
              </div>

              {/* Back Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    if (window.history.length > 1) {
                      navigate(-1);
                    } else {
                      navigate('/');
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 border border-cordillera-cream/40 text-cordillera-cream/90 hover:text-cordillera-cream hover:bg-cordillera-cream/10 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Return to previous page
                </button>
              </div>

              {/* Registration Form */}
              <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-light text-cordillera-cream mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cordillera-cream/50">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      </span>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/60 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-light text-cordillera-cream mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cordillera-cream/50">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
                      </span>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/60 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-light text-cordillera-cream mb-2">
                      I am a...
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cordillera-cream/50">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7h16M4 12h8m-8 5h16"/></svg>
                      </span>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                      >
                        <option value="customer">Customer (I want to buy and support artisans)</option>
                        <option value="artisan">Artisan (I create and sell traditional crafts)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-light text-cordillera-cream mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cordillera-cream/50">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4"/></svg>
                      </span>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/60 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                        placeholder="Create a password (min 6 characters)"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-light text-cordillera-cream mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cordillera-cream/50">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4"/></svg>
                      </span>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/60 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                        placeholder="Confirm your password"
                      />
                    </div>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
};