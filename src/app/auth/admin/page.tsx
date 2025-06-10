'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { AuthInput, AuthError, AuthButton, AuthLink, AuthInputGroup } from '@/components/AuthFormComponents';

export default function AdminLoginPage() {
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

    try {
      const success = await login(email, password, 'admin');
      if (success) {
        router.push('/admin/dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err) {
      setError('An error occurred during admin login');
    } finally {
      setIsLoading(false);
    }
  };

  const adminIcon = (
    <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <AuthLayout
      title="Admin Access"
      subtitle="Sign in with your administrator credentials"
      icon={adminIcon}
      accentColor="purple"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthInputGroup>
          <AuthInput
            id="email"
            name="email"
            type="email"
            label="Admin Email Address"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            position="top"
          />
          <AuthInput
            id="password"
            name="password"
            type="password"
            label="Admin Password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            position="bottom"
          />
        </AuthInputGroup>

        {error && <AuthError message={error} />}

        <AuthButton
          isLoading={isLoading}
          loadingText="Signing in..."
          buttonText="Sign in as Admin"
          accentColor="purple"
        />

        <div className="text-center pt-4 border-t border-white/20">
          <AuthLink href="/" variant="secondary">
            ← Back to home
          </AuthLink>
        </div>
      </form>
    </AuthLayout>
  );
}