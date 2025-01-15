import axios from 'axios';
import { getSession, signIn } from 'next-auth/react';
import { refreshAccessToken } from '../utils/refreshTokenUtil'; // Adjust path
import AuthPage from '../components/Auth/AuthPage';
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];
const addToQueue = () =>
  new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  });
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

instance.interceptors.request.use(
  async (config) => {
    if (!config.skipAuth) {
      const session = await getSession();
      let token = session?.accessToken;

      // If token is missing or expired, attempt to refresh
      if (session && !token) {
        if (!isRefreshing) {
          isRefreshing = true;
          const newToken = await refreshAccessToken(session.refreshToken);
          if (newToken) {
            token = newToken;
          } else {
            // signIn(); // Redirect to login if refresh fails
          return <AuthPage />

          }
          isRefreshing = false;
          processQueue(null, newToken);
        } else {
          // Queue requests until refresh completes
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            return config;
          });
        }
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
