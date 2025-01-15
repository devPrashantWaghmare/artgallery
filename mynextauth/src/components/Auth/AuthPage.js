'use client';
import { useState, useEffect, useCallback } from 'react';
import { getProviders, signIn, useSession } from 'next-auth/react';
import AuthOTP from './AuthOTP';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import RedirectUserBasedOnRole from '../../utils/redirect';
import axios from '../../services/api';

export default function AuthPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loginMethod, setLoginMethod] = useState('providers');
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProviders().then((res) => setProviders(Object.values(res ||[]))).catch(() => setError('Failed to load login providers.'));
  }, []);

  const handleSocialSignIn = useCallback(async (providerId) => {
    try {
      setIsLoading(true);
      setError('');
      const result = await signIn(providerId, { redirect: false });
      if (result?.error)
        throw new Error(result.error);
    } catch (err) {
      setError(err.message || 'An error occurred during social login.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const providerIcons = {
    Google: <FaGoogle className="text-red-500 text-xl" />,
    GitHub: <FaGithub className="text-gray-800 text-xl" />,
    Facebook: <FaFacebook className="text-blue-600 text-xl" />,
  };

  const renderProvidersLogin = () => (
    <div>
      <h2 className="text-lg font-bold mb-4 text-center">Sign in with</h2>
      <div className="space-y-4">
        {providers.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleSocialSignIn(provider.id)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
          >
            {providerIcons[provider.name] || null}
            <span className="font-medium text-gray-700">
              Continue with {provider.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h1>

        <div className="flex justify-center space-x-4 mb-6">
          {['providers', 'otp'].map((method) => (
            <button
              key={method}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                loginMethod === method ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setLoginMethod(method)}
            >
              {method === 'providers' ? 'Social Login' : 'OTP Login'}
            </button>
          ))}
        </div>

        {loginMethod === 'providers' ? renderProvidersLogin() : <AuthOTP />}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
