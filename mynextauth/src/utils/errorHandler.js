// utils/errorHandler.js

export const handleApiError = (error) => {
    if (error.response) {
        // Handle HTTP errors
        switch (error.response.status) {
            case 404:
                return '404 The requested data could not be found. Please check the API endpoint.';
            case 401:
                return '401 You are not authorized to view this data. Please log in again.';
            case 500:
                return '500 Internal server error. Please try again later.';
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    } else if (error.request) {
        // Handle network or request errors
        return 'Network error. Please check your internet connection.';
    } else {
        // Handle other types of errors
        return 'An error occurred. Please try again.';
    }
};
