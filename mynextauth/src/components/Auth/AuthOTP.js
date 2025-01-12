/*  'use client';

import React, { useState, useEffect } from 'react';
import styles from '../../styles/AuthOTP.module.css';
import axios from '../../services/api';
import { useRouter } from 'next/navigation';
import ErrorPage from '../Error/ErrorPage';
import RedirectUserBasedOnRole from '../../utils/redirect';

const AuthOTP = () => {
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();
  const [error, setError] = useState(null);

  const formatMobileNumber = (number) => `+91${number.trim()}`;

  // Resend timer logic
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const setMessageHandler = (type, text) => setMessage({ type, text });

  const requestOtp = async () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      setMessageHandler("error", "Invalid phone number");
      return;
    }
    if (mobileNumber.length !== 10 || isNaN(mobileNumber)) {
      setMessageHandler('error', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const formattedNumber = formatMobileNumber(mobileNumber);
      await axios.post('/api/otp/requestOtp', { mobile: formattedNumber });
      setOtpRequested(true);
      setMessageHandler('success', 'OTP sent successfully.');
      setResendTimer(30);
    } catch (error) {
      setError('Failed to request OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setMessageHandler('error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const formattedNumber = formatMobileNumber(mobileNumber);
      const response = await axios.post('/api/otp/verifyOtp', { mobile: formattedNumber, otp });
      console.log(response);
      const { user, userId, token,role } = response.data;

      localStorage.setItem('userId', user.id);
      localStorage.setItem('token', token);
      localStorage.setItem('name', user.username);
      localStorage.setItem('role', user.role);

      RedirectUserBasedOnRole(router,user.role || "user");
    } catch (error) {
      setError('OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };
  if (error) {
    return (
      <ErrorPage
        error={error}
        onRetry={() => {
          setError(null); // Clear error and retry
        }}
      />
    );
  }
   return (
    <div className={styles.authContainer}>
      <h3>Login with OTP</h3>
      <div className={styles.inputGroup}>
        <label htmlFor="mobileNumber">Mobile Number</label>
        <input
          type="text"
          id="mobileNumber"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          required
          disabled={otpRequested}
          placeholder="Enter 10-digit mobile number"
        />
      </div>
      {otpRequested && (
        <div className={styles.inputGroup}>
          <label htmlFor="otp">Enter OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            placeholder="Enter 6-digit OTP"
          />
        </div>
      )}
      <button
        className={styles.submitBtn}
        onClick={otpRequested ? verifyOtp : requestOtp}
        disabled={loading}
      >
        {loading ? 'Processing...' : otpRequested ? 'Verify OTP' : 'Request OTP'}
      </button>
      {otpRequested && resendTimer === 0 && (
        <button
          onClick={requestOtp}
          className={`${styles.submitBtn} mt-2`}
          disabled={loading}
        >
          Resend OTP
        </button>
      )}
      {message.text && (
        <p
          className={
            message.type === 'error' ? styles.errorMessage : styles.successMessage
          }
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default AuthOTP;

 */

//src/components/Auth/AuthOTP.js

'use client';

import React, { useState, useEffect } from 'react';
import styles from '../../styles/AuthOTP.module.css';
import axios from '../../services/api';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import ErrorPage from '../Error/ErrorPage';
import RedirectUserBasedOnRole from '../../utils/redirect';

const AuthOTP = () => {
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const formatMobileNumber = (number) => `+91${number.trim()}`;

  // Resend timer logic
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const setMessageHandler = (type, text) => setMessage({ type, text });

  const requestOtp = async () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      setMessageHandler('error', 'Invalid phone number');
      return;
    }

    setLoading(true);
    try {
      const formattedNumber = formatMobileNumber(mobileNumber);
      await axios.post('/api/otp/requestOtp', { mobile: formattedNumber });
      setOtpRequested(true);
      setMessageHandler('success', 'OTP sent successfully.');
      setResendTimer(30);
    } catch (error) {
      setError('Failed to request OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setMessageHandler('error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const formattedNumber = formatMobileNumber(mobileNumber);
      const response = await signIn('credentials', {
        redirect: false,
        mobile: formattedNumber,
        otp,
      });

      if (response?.error) {
        setMessageHandler({ type: 'error', text: 'OTP verification failed.' });

        setError('OTP verification failed.');
        return;
      }

      // Redirect user based on role stored in the session
      const userRole = session?.user?.role || 'user';
      RedirectUserBasedOnRole(router,userRole || "user");

     // router.push(userRole === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (error) {
      setError('OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <ErrorPage
        error={error}
        onRetry={() => {
          setError(null); // Clear error and retry
        }}
      />
    );
  }

  return (
    <div className={styles.authContainer}>
      <h3>Login with OTP</h3>
      <div className={styles.inputGroup}>
        <label htmlFor="mobileNumber">Mobile Number</label>
        <input
          type="text"
          id="mobileNumber"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          required
          disabled={otpRequested}
          placeholder="Enter 10-digit mobile number"
        />
      </div>
      {otpRequested && (
        <div className={styles.inputGroup}>
          <label htmlFor="otp">Enter OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            placeholder="Enter 6-digit OTP"
          />
        </div>
      )}
      <button
        className={styles.submitBtn}
        onClick={otpRequested ? verifyOtp : requestOtp}
        disabled={loading}
      >
        {loading ? 'Processing...' : otpRequested ? 'Verify OTP' : 'Request OTP'}
      </button>
      {otpRequested && resendTimer === 0 && (
        <button
          onClick={requestOtp}
          className={`${styles.submitBtn} mt-2`}
          disabled={loading}
        >
          Resend OTP
        </button>
      )}
      {message.text && (
        <p
          className={
            message.type === 'error' ? styles.errorMessage : styles.successMessage
          }
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default AuthOTP;
