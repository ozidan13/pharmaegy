'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { AuthInput, AuthError, AuthButton, AuthLink, AuthInputGroup } from '@/components/AuthFormComponents';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        // Redirect based on user role or default to home
        router.push('/');
      } else {
        setError('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginIcon = (
    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  );

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
      icon={loginIcon}
      accentColor="blue"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthInputGroup>
          <AuthInput
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            required
            autoComplete="email"
            position="top"
            accentColor="blue"
          />
          <AuthInput
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            position="bottom"
            accentColor="blue"
          />
        </AuthInputGroup>

        {error && <AuthError message={error} />}

        <AuthButton
          isLoading={isLoading}
          loadingText="Signing in..."
          buttonText="Sign In"
          accentColor="blue"
        />

        <div className="text-center space-y-4">
          <p className="text-sm text-white/70">
            Don't have an account?
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <AuthLink href="/auth/register/pharmacist" variant="primary">
              Register as Pharmacist
            </AuthLink>
            <span className="hidden sm:inline text-white/30">|</span>
            <AuthLink href="/auth/register/pharmacy-owner" variant="primary">
              Register as Owner
            </AuthLink>
          </div>
        </div>

        <div className="text-center pt-4 border-t border-white/20 space-y-2">
          <AuthLink href="/auth/admin" variant="secondary">
            Admin Login
          </AuthLink>
          <div className="mt-2">
            <AuthLink href="/" variant="secondary" showArrow>
              Return to Home
            </AuthLink>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}