import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const VerifySuccessPage: React.FC = () => {
  const [params] = useSearchParams();
  const status = params.get('status'); // 'verified' | 'already' | null
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const intended = React.useMemo(() => sessionStorage.getItem('intended_path') || '', []);

  const goNext = () => {
    // Prefer intended path if exists
    if (intended) {
      sessionStorage.removeItem('intended_path');
      navigate(intended, { replace: true });
      return;
    }

    if (isAuthenticated) {
      const role = (user as any)?.role;
      if (role === 'artisan') return navigate('/dashboard/artisan', { replace: true });
      if (role === 'customer') return navigate('/dashboard/customer', { replace: true });
      return navigate('/', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  const title = status === 'already' ? 'Email Already Verified' : 'Email Verified';
  const desc = status === 'already'
    ? 'Your email is already verified. You can continue to your account.'
    : 'Thanks for verifying your email. Your account is now active.';

  return (
    <div className="min-h-screen bg-cordillera-olive flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center bg-cordillera-cream/5 border border-cordillera-gold/20 p-10 space-y-5">
        <h1 className="text-3xl font-serif font-light text-cordillera-cream tracking-wide">{title}</h1>
        <p className="text-cordillera-cream/90">{desc}</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={goNext}
            className="px-5 py-2 bg-cordillera-gold text-cordillera-olive hover:bg-cordillera-gold/90"
          >
            Continue
          </button>
          <Link to="/" className="text-cordillera-gold hover:text-cordillera-gold/80 text-sm">Return Home</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifySuccessPage;
