import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

const VerifyEmailPage = () => {
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

  // Built-in verification handled by backend signed link; no client token handling

  const sendLinkMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/email/verification-notification', { email });
      return response.data;
    },
    onSuccess: () => {
      setCountdown(60);
      setSuccessMessage('Verification link sent. Check your inbox.');
      setErrorMessage('');
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Failed to send verification link');
      setSuccessMessage('');
    },
  });

  // No verify mutation needed; backend redirects on signed link

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = () => {
    if (countdown > 0) return;
    sendLinkMutation.mutate();
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
            Click the verification link we emailed to <strong>{email}</strong>.
            If you didn't receive it, resend below.
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

          <div className="space-y-4">
            <Button
              onClick={handleResend}
              className="w-full bg-cordillera-gold text-cordillera-olive hover:bg-cordillera-gold/90"
              disabled={sendLinkMutation.isPending || countdown > 0}
            >
              {sendLinkMutation.isPending
                ? 'Sending...'
                : countdown > 0
                ? `Resend in ${countdown}s`
                : 'Resend verification link'}
            </Button>
          </div>

          <div className="mt-2 text-center text-sm text-cordillera-cream/70">Check spam folder if needed.</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
