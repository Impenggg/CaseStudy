import React from 'react';
import { useLocation } from 'react-router-dom';

const VerifyEmailPage = () => {
  const location = useLocation();
  const { email } = location.state || { email: '' };

  return (
    <div className="min-h-screen bg-cordillera-olive flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-serif font-light text-cordillera-cream tracking-wide mb-2">
          Verify Your Email
        </h1>
        <p className="text-cordillera-cream/90">
          A verification link has been sent to <strong>{email}</strong>.
        </p>
        <p className="text-cordillera-cream/90">
          Please check your inbox and click the link to activate your account.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
