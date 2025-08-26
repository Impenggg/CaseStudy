import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromState = (location.state as any)?.from?.pathname as string | undefined;
  const intendedPath = (typeof window !== 'undefined') ? sessionStorage.getItem('intended_path') || undefined : undefined;
  const redirectTo = fromState || intendedPath || undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        if (intendedPath) sessionStorage.removeItem('intended_path');
        if (redirectTo) {
          navigate(redirectTo, { replace: true });
        } else {
          // Default to homepage when there is no intended path
          navigate('/', { replace: true });
        }
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-cordillera-olive py-10 sm:py-12">
      {/* Background gradient + woven pattern */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
        <svg className="absolute -top-10 -left-10 w-[500px] h-[500px] opacity-[0.06]" viewBox="0 0 200 200" aria-hidden>
          <defs>
            <pattern id="weave" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="20" height="20" fill="none" />
              <path d="M0 10 H20 M10 0 V20" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#weave)" />
        </svg>
        <svg className="absolute bottom-0 right-0 w-[600px] h-[600px] opacity-[0.05] rotate-12" viewBox="0 0 200 200" aria-hidden>
          <defs>
            <pattern id="weave" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="20" height="20" fill="none" />
              <path d="M0 10 H20 M10 0 V20" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#weave)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Hero panel */}
          <div className="hidden lg:flex relative overflow-hidden rounded-md border border-cordillera-gold/20 bg-cordillera-cream/5">
            <div className="absolute inset-0 bg-gradient-to-br from-cordillera-gold/10 via-transparent to-cordillera-gold/10" />
            <div className="relative z-10 p-10 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-serif text-cordillera-cream">Cordillera Weaving</h1>
                <p className="mt-4 text-cordillera-cream/80 leading-relaxed max-w-md">
                  Discover stories and handcrafted pieces from the highlands. Sign in to support artisans, save favorites, and continue your journey.
                </p>
              </div>
              <ul className="mt-10 space-y-3 text-cordillera-cream/80 text-sm">
                <li className="flex items-center"><span className="mr-2 text-cordillera-gold">•</span> Seamless checkout and campaign support</li>
                <li className="flex items-center"><span className="mr-2 text-cordillera-gold">•</span> Save artworks and stories you love</li>
                <li className="flex items-center"><span className="mr-2 text-cordillera-gold">•</span> Personalized recommendations</li>
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
                  Welcome Back
                </h2>
                <p className="mt-2 text-sm text-cordillera-cream/70">
                  Sign in to your account to continue your journey
                </p>
              </div>

              {/* Single Back Button (centered) */}
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

              {/* Login Form */}
              <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-light text-cordillera-cream mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cordillera-cream/50">
                        {/* Mail icon */}
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
                      </span>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/60 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-light text-cordillera-cream mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cordillera-cream/50">
                        {/* Lock icon */}
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4"/></svg>
                      </span>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/60 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-cordillera-cream/60 hover:text-cordillera-cream"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4.5-9-7 0-1.01 1.09-2.93 3.064-4.659M21 12c0 .933-.413 2.14-1.28 3.39M3 3l18 18M9.88 9.88A3 3 0 0114.12 14.12"/></svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remember/Forgot */}
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center text-sm text-cordillera-cream/80 select-none">
                    <input type="checkbox" className="mr-2 accent-cordillera-gold" />
                    Remember me
                  </label>
                  <a href="#" className="text-sm text-cordillera-gold hover:text-cordillera-gold/80">Forgot password?</a>
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

              {/* Social proof */}
              <div className="mt-8 pt-6 border-t border-cordillera-gold/20">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <span className="px-3 py-1 text-xs bg-cordillera-cream/5 border border-cordillera-gold/20 text-cordillera-cream/80">Trusted by local artisans</span>
                  <span className="px-3 py-1 text-xs bg-cordillera-cream/5 border border-cordillera-gold/20 text-cordillera-cream/80">Secure checkout</span>
                  <span className="px-3 py-1 text-xs bg-cordillera-cream/5 border border-cordillera-gold/20 text-cordillera-cream/80">Community-driven</span>
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