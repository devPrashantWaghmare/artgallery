// utils/auth.js
import { setAuthCookie, getAuthCookie } from './cookies';
import { login, logout } from '../redux/authSlice';
import store from '../redux/store';

export const initializeSession = () => {
    const userData = getAuthCookie();
    if (userData) {
        store.dispatch(login(userData)); // Set state from cookie
    } else {
        store.dispatch(logout()); // Clear state if no cookie
    }
};
