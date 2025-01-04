'use client';

import ErrorPage from '../../../components/Error/ErrorPage';

const ErrorRoutePage = () => {
  return (
    <ErrorPage
      error="An unexpected error occurred."
      onRetry={() => {
        // Logic to retry or redirect
        window.location.href = '/'; // Redirect to home page or login
      }}
    />
  );
};

export default ErrorRoutePage;
