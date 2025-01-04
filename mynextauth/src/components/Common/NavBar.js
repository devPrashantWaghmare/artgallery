// components/NavBar.js
'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuth } from '../../store/slices/authSlice';
import roleRoutes from '../../utils/roleRoutes';

import '../../styles/NavBar.css';

const NavBar = () => {
    const { isLoggedIn, userName, userRole } = useSelector(selectAuth); 
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        router.replace('/'); // Redirect to home after logout
    };

    const dashboardLink = useMemo(() => {
        const route = roleRoutes[userRole];
        if (route) {
            return (
                <Link href={route} className="dashboard-link">
                    {`${userRole.charAt(0).toUpperCase()}${userRole.slice(1)} Dashboard`}
                </Link>
            );
        }
        return null;
    }, [userRole]);

    return (
        <nav className="navbar">
            <div className="logo bg-gradient-to-r from-yellow-200 to-white-600">ART GALLERY</div>
            <div className="nav-links">
                <Link href="/">Home</Link>
                <Link href="/products">Products</Link>
                <Link href="/contact">Contact</Link>
                {isLoggedIn ? (
                    <>
                        {dashboardLink}
                        <div className="user-section">
                            <span className="welcome-message">Welcome, {userName}</span>
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <Link href="/login">
                        <button className="login-btn">
                            Login/Sign Up
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
