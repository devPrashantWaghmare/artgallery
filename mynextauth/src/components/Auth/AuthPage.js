/* /* 'use client';

import { useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import AuthOTP from './AuthOTP';

export default function AuthPage() {
  const [loginMethod, setLoginMethod] = useState('providers'); // Default to 'providers'
  const [providers, setProviders] = useState(null);

  // Fetch providers for provider-based login
  useState(() => {
    async function fetchProviders() {
      const res = await getProviders();
      setProviders(res);
    }
    fetchProviders();
  }, []);

  const renderProvidersLogin = () => (
    <div>
      <h2 className="text-lg font-bold mb-4">Login by Providers</h2>
      {providers &&
        Object.values(providers).map((provider) => (
          <button
            key={provider.name}
            onClick={() => signIn(provider.id)}
            className="w-full px-4 py-2 mb-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Sign in with {provider.name}
          </button>
        ))}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

        
        <div className="flex justify-center space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              loginMethod === 'providers'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setLoginMethod('providers')}
          >
            Providers
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              loginMethod === 'otp'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setLoginMethod('otp')}
          >
            OTP
          </button>
        </div>

        {loginMethod === 'providers' ? renderProvidersLogin() : <AuthOTP />}
      </div>
    </div>
  );
}

*/
/* 
'use client';

import { useState, useEffect } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import AuthOTP from './AuthOTP';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';

export default function AuthPage() {
  const [loginMethod, setLoginMethod] = useState('providers');
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    async function fetchProviders() {
      const res = await getProviders();
      setProviders(res);
    }
    fetchProviders();
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
        {providers &&
          Object.values(providers).map((provider) => (
            <button
              key={provider.name}
              onClick={() => signIn(provider.id)}
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
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              loginMethod === 'providers'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => setLoginMethod('providers')}
          >
            Social Login
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              loginMethod === 'otp'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => setLoginMethod('otp')}
          >
            OTP Login
          </button>
        </div>

        {loginMethod === 'providers' ? renderProvidersLogin() : <AuthOTP />}
      </div>
    </div>
  );
}
 */
 
'use client';

import { useState, useEffect } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import AuthOTP from './AuthOTP';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';

export default function AuthPage() {
  const [loginMethod, setLoginMethod] = useState('providers');
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    async function fetchProviders() {
      const res = await getProviders();
      setProviders(res);
    }
    fetchProviders();
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
        {providers &&
          Object.values(providers).map((provider) => (
            <button
              key={provider.name}
              onClick={() =>
                signIn(provider.id, {
                  callbackUrl: '/', // Redirect URL after login
                  //prompt: 'select_account', // Force account selection
                })
              }
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
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              loginMethod === 'providers'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => setLoginMethod('providers')}
          >
            Social Login
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              loginMethod === 'otp'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => setLoginMethod('otp')}
          >
            OTP Login
          </button>
        </div>

        {loginMethod === 'providers' ? renderProvidersLogin() : <AuthOTP />}
      </div>
    </div>
  );
}
