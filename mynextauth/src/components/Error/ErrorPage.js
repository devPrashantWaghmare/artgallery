/* 'use client';

const ErrorPage = ({ error, onRetry }) => (
  <div className="min-h-screen flex items-center justify-center bg-red-100">
    <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
      <p className="text-gray-800 mb-4">{error || 'An unexpected error occurred.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      )}
    </div>
  </div>
);

export default ErrorPage;
 */

'use client';

const ErrorPage = ({ error, onRetry }) => {
  return (
    <div>
      <h1>Error</h1>
      <p>{error}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
};

export default ErrorPage;
