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

  const handleRefreshStatus = async () => {
    try {
      await refreshUser();
      // If user is now verified, the ProtectedRoute will redirect them
    } catch (error) {
      console.error('Failed to refresh user status:', error);
    }
  };


  return (
    <div className="min-h-screen bg-heritage-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-6 text-center bg-heritage-100/5 border border-heritage-500/20 p-8">
        <CardHeader>
          <CardTitle className="text-3xl font-serif font-light text-heritage-100 tracking-wide">
            Verify Your Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-heritage-100/90 mb-6">
            Click the verification link we emailed to <strong>{email}</strong>.
            If you didn't receive it, resend below.
          </p>

          {successMessage && (
            <div className="text-sm text-green-200 bg-green-900/20 border border-green-700/40 px-3 py-2 mb-4">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="text-sm text-error-light bg-red-900/20 border border-red-700/40 px-3 py-2 mb-4">
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleResend}
              className="w-full bg-heritage-500 text-heritage-800 hover:bg-heritage-500/90"
              disabled={sendLinkMutation.isPending || countdown > 0}
            >
              {sendLinkMutation.isPending
                ? 'Sending...'
                : countdown > 0
                ? `Resend in ${countdown}s`
                : 'Resend verification link'}
            </Button>
            
            <Button
              onClick={handleRefreshStatus}
              variant="outline"
              className="w-full border-heritage-500/50 text-heritage-200 hover:bg-heritage-500/10"
            >
              Refresh Status
            </Button>
          </div>

          <div className="mt-2 text-center text-sm text-heritage-100/70">Check spam folder if needed.</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
