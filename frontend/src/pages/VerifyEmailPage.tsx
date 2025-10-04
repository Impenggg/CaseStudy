import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    // Get email from location state or user context
    const emailFromState = location.state?.email || user?.email;
    if (!emailFromState) {
      navigate('/register', { replace: true });
      return;
    }
    setEmail(emailFromState);
  }, [location.state, user, navigate]);

  // Auto-send OTP when page loads and email is known
  useEffect(() => {
    if (email && countdown === 0 && !sendOtpMutation.isPending) {
      sendOtpMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/email/verify/send-otp', { email });
      return response.data;
    },
    onSuccess: () => {
      setCountdown(60);
      setSuccessMessage('OTP sent successfully');
      setErrorMessage('');
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Failed to send OTP');
      setSuccessMessage('');
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (otpCode: string) => {
      const response = await api.post('/email/verify', {
        email,
        otp: otpCode,
      });
      return response.data;
    },
    onSuccess: async () => {
      setSuccessMessage('Email verified successfully!');
      setErrorMessage('');
      // Refresh user data to get updated email_verified_at
      await refreshUser();
      navigate('/verify-success');
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Verification failed');
      setSuccessMessage('');
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setErrorMessage('Please enter a 6-digit code');
      setSuccessMessage('');
      return;
    }
    verifyOtpMutation.mutate(otpCode);
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    sendOtpMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-cordillera-olive flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-6 text-center bg-cordillera-cream/5 border border-cordillera-gold/20 p-8">
        <CardHeader>
          <CardTitle className="text-3xl font-serif font-light text-cordillera-cream tracking-wide">
            Verify Your Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-cordillera-cream/90 mb-6">
            We've sent a 6-digit verification code to <strong>{email}</strong>
          </p>

          {successMessage && (
            <div className="text-sm text-green-200 bg-green-900/20 border border-green-700/40 px-3 py-2 mb-4">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="text-sm text-red-200 bg-red-900/20 border border-red-700/40 px-3 py-2 mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-xl bg-cordillera-cream text-cordillera-olive"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-cordillera-gold text-cordillera-olive hover:bg-cordillera-gold/90"
              disabled={verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={handleResendOtp}
              disabled={countdown > 0 || sendOtpMutation.isPending}
              className="text-cordillera-gold hover:text-cordillera-gold/80"
            >
              {sendOtpMutation.isPending
                ? 'Sending...'
                : countdown > 0
                ? `Resend in ${countdown}s`
                : "Didn't receive a code? Resend"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
