// frontend/src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Define initial state for auth
const initialState = {
    isLoggedIn: false,
    userName: '',
    userRole: '',
};

// Create a slice of auth state
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.userName = action.payload.userName;
            state.userRole = action.payload.userRole;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.userName = '';
            state.userRole = '';
        },
    },
});

// Export actions
export const { login, logout } = authSlice.actions;

// Export selector to access auth state
export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
