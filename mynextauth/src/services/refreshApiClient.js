import axios from 'axios';

const refreshApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,  // Important for sending cookies
});


export default refreshApiClient;
