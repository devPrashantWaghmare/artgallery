// ../services/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;




/* 
import axios from 'axios';
import { getSession } from 'next-auth/react';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the token
instance.interceptors.request.use(
  async (config) => {
    const session = await getSession(); // Get the current session
    const token = session?.accessToken; // Extract the token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to headers
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
 */


/* Add a custom property (e.g., skipAuth) in the request config.
Check for this property in the request interceptor before injecting the token.
Updated Code */

// import axios from 'axios';
// import { getSession } from 'next-auth/react';

// const instance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add a request interceptor to inject the token conditionally
// instance.interceptors.request.use(
//   async (config) => {
//     if (!config.skipAuth) {  // Check if skipAuth is not true
//       const session = await getSession(); // Get the current session
//       const token = session?.accessToken; // Extract the token

//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`; // Add token to headers
//       }
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default instance;


