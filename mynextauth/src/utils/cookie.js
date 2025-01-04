// utils/cookie.js
import cookie from 'js-cookie';

// Save token to cookies or localStorage (if cookies are disabled)
export const setToken = (token) => {
    if (navigator.cookieEnabled) {
        // Store token in cookies with secure attributes
        cookie.set('token', token, { secure: true, sameSite: 'Strict', expires: 7 });
    } else {
        // Fallback to localStorage if cookies are disabled
        localStorage.setItem('token', token);
    }
};

// Retrieve token from cookies or localStorage
export const getToken = () => {
    if (navigator.cookieEnabled) {
        return cookie.get('token');
    } else {
        return localStorage.getItem('token');
    }
};

// Remove token from cookies or localStorage
export const removeToken = () => {
    if (navigator.cookieEnabled) {
        cookie.remove('token');
    } else {
        localStorage.removeItem('token');
    }
};

// Save user data to cookies or localStorage (if cookies are disabled)
export const setAuthCookie = (userData) => {
    if (navigator.cookieEnabled) {
        cookie.set('auth', JSON.stringify(userData), { expires: 7, secure: true, sameSite: 'Strict' });
    } else {
        localStorage.setItem('auth', JSON.stringify(userData));
    }
};

// Retrieve user data from cookies or localStorage
export const getAuthCookie = () => {
    const cookieData = navigator.cookieEnabled ? cookie.get('auth') : localStorage.getItem('auth');
    return cookieData ? JSON.parse(cookieData) : null;
};

// Remove user data from cookies or localStorage
export const removeAuthCookie = () => {
    if (navigator.cookieEnabled) {
        cookie.remove('auth');
    } else {
        localStorage.removeItem('auth');
    }
};
