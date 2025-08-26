import React, { useMemo, useState } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()), [formData.email]);
  const nameValid = useMemo(() => formData.name.trim().length >= 2, [formData.name]);
  const passwordValid = useMemo(() => formData.password.length >= 8, [formData.password]);
  const confirmValid = useMemo(() => formData.confirmPassword === formData.password && formData.confirmPassword.length > 0, [formData.confirmPassword, formData.password]);
  const formValid = emailValid && nameValid && passwordValid && confirmValid;

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

  const strength = useMemo(() => {
    const p = formData.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return Math.min(score, 4); // 0..4
  }, [formData.password]);

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
            <div className="relative z-10 p-10 flex flex-col">
              <div>
                <h1 className="text-4xl font-serif text-cordillera-cream">Welcome to the Community</h1>
                <p className="mt-4 text-cordillera-cream/80 leading-relaxed max-w-md">
                  Create an account to support artisans, collect stories, and be part of preserving Cordillera heritage.
                </p>
              </div>
              {/* Raised, enlarged square with role selection */}
              <div className="mt-6 flex-1 w-full flex items-start justify-center pb-2">
                <div className="w-96 h-[26rem] rounded-md border border-cordillera-gold/30 bg-black/20 shadow-[0_0_0_1px_rgba(212,175,55,0.08)_inset] p-6 flex flex-col items-center">
                  <p className="text-center text-cordillera-gold font-medium">Join As:</p>

                  {/* Spacer */}
                  <div className="mt-4" />

                  {/* Customer tile */}
                  <div
                    className={`group flex flex-col items-center justify-center gap-2 rounded-md bg-black/20 border border-cordillera-gold/20 w-32 h-32 hover:bg-black/30 transition-colors cursor-pointer ${formData.role === 'customer' ? 'ring-1 ring-cordillera-gold' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setFormData(f => ({ ...f, role: 'customer' }))}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFormData(f => ({ ...f, role: 'customer' })); }}
                  >
                    <div className="text-cordillera-gold">
                      <svg className="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <p className="text-base font-medium text-cordillera-gold">Customer</p>
                  </div>

                  {/* OR divider */}
                  <div className="my-4 text-center text-cordillera-gold">Or</div>

                  {/* Artisan tile */}
                  <div
                    className={`group flex flex-col items-center justify-center gap-2 rounded-md bg-black/20 border border-cordillera-gold/20 w-32 h-32 hover:bg-black/30 transition-colors cursor-pointer ${formData.role === 'artisan' ? 'ring-1 ring-cordillera-gold' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setFormData(f => ({ ...f, role: 'artisan' }))}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFormData(f => ({ ...f, role: 'artisan' })); }}
                  >
                    <div className="text-cordillera-gold">
                      <svg className="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7h3l3 7 4-12 3 8h4"/></svg>
                    </div>
                    <p className="text-base font-medium text-cordillera-gold">Artisan</p>
                  </div>

                  {/* fill remaining space to keep square balanced */}
                  <div className="mt-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className="relative">
            <Card className="mx-auto max-w-md w-full bg-cordillera-cream/5 border border-cordillera-gold/20 backdrop-blur-sm">
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
              <form className="mt-2 space-y-6" onSubmit={handleSubmit} noValidate>
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
                        onBlur={() => setTouched(t => ({ ...t, name: true }))}
                        aria-invalid={touched.name && !nameValid}
                        className="w-full pl-10 pr-4 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/60 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    {touched.name && !nameValid && (
                      <p className="mt-1 text-xs text-red-300">Please enter at least 2 characters.</p>
                    )}
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
                        onBlur={() => setTouched(t => ({ ...t, email: true }))}
                        aria-invalid={touched.email && !emailValid}
                        aria-describedby="email-error"
                        className="w-full pl-10 pr-4 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/60 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                    {touched.email && !emailValid && (
                      <p id="email-error" className="mt-1 text-xs text-red-300">Please enter a valid email address.</p>
                    )}
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
                        className="w-full pl-10 pr-4 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent appearance-none"
                      >
                        <option className="text-cordillera-olive" value="customer">Customer (I want to buy and support artisans)</option>
                        <option className="text-cordillera-olive" value="artisan">Artisan (I create and sell traditional crafts)</option>
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
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={() => setTouched(t => ({ ...t, password: true }))}
                        onKeyUp={(e) => setCapsOn(e.getModifierState && e.getModifierState('CapsLock'))}
                        aria-invalid={touched.password && !passwordValid}
                        aria-describedby="password-help password-error"
                        className="w-full pl-10 pr-10 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/60 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                        placeholder="Create a password (min 6 characters)"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-cordillera-cream/60 hover:text-cordillera-cream"
                        onClick={() => setShowPassword(s => !s)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4.5-9-7 0-1.01 1.09-2.93 3.064-4.659M21 12c0 .933-.413 2.14-1.28 3.39M3 3l18 18M9.88 9.88A3 3 0 0114.12 14.12"/></svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                    {capsOn && (
                      <p className="mt-1 text-xs text-amber-200">Caps Lock is on.</p>
                    )}
                    {touched.password && !passwordValid && (
                      <p id="password-error" className="mt-1 text-xs text-red-300">Password must be at least 8 characters.</p>
                    )}
                    {/* Strength meter */}
                    <div className="mt-2" aria-hidden>
                      <div className="h-1 w-full bg-cordillera-cream/10">
                        <div className={
                          `h-1 transition-all ${
                            strength <= 1 ? 'w-1/4 bg-red-400' : strength === 2 ? 'w-2/4 bg-amber-300' : strength === 3 ? 'w-3/4 bg-lime-300' : 'w-full bg-green-400'
                          }`
                        }/>
                      </div>
                      <p className="mt-1 text-xs text-cordillera-cream/70">
                        Password strength: {['Very weak','Weak','Good','Strong','Strong'][strength]}
                      </p>
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
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={() => setTouched(t => ({ ...t, confirmPassword: true }))}
                        aria-invalid={touched.confirmPassword && !confirmValid}
                        aria-describedby="confirm-error"
                        className="w-full pl-10 pr-10 py-3 bg-cordillera-cream/10 border border-cordillera-gold/30 text-cordillera-cream placeholder-cordillera-cream/60 focus:outline-none focus:ring-2 focus:ring-cordillera-gold focus:border-transparent"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-cordillera-cream/60 hover:text-cordillera-cream"
                        onClick={() => setShowConfirm(s => !s)}
                        aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirm ? (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4.5-9-7 0-1.01 1.09-2.93 3.064-4.659M21 12c0 .933-.413 2.14-1.28 3.39M3 3l18 18M9.88 9.88A3 3 0 0114.12 14.12"/></svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                    {touched.confirmPassword && !confirmValid && (
                      <p id="confirm-error" className="mt-1 text-xs text-red-300">Passwords do not match.</p>
                    )}
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
                    disabled={isLoading || !formValid}
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
            </CardContent>
          </Card>
        </div>
    </div>
  </div>
</div>
  );
};