/* "use client";
import React, { useState } from "react";
import AuthPage from "./Auth/AuthPage"; // Import AuthPage component
import { signIn } from "next-auth/react"; // For provider-based authentication

const UserModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual login state from your app
  const [authMode, setAuthMode] = useState(null); // 'login', 'signup', or 'otp'

  const toggleModal = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Add logout logic here
    setIsLoggedIn(false);
    toggleModal();
  };

  const handleProviderLogin = async (provider) => {
    try {
      await signIn(provider);
    } catch (err) {
      console.error("Error logging in with provider:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleModal}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        User
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border rounded shadow-lg p-4">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => alert("Profile clicked")}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={() => alert("Account clicked")}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Account
              </button>
              <button
                onClick={() => alert("Settings clicked")}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : authMode === "otp" ? (
            <AuthPage /> // Render OTP login page
          ) : authMode === "providers" ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">Login with</h3>
              <button
                onClick={() => handleProviderLogin("google")}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Google
              </button>
              <button
                onClick={() => handleProviderLogin("github")}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                GitHub
              </button>
              <button
                onClick={() => handleProviderLogin("facebook")}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Facebook
              </button>
              <button
                onClick={() => setAuthMode(null)} // Go back
                className="mt-4 w-full px-4 py-2 bg-gray-200 rounded text-center"
              >
                Back
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-2">Choose a Login Method</h3>
              <button
                onClick={() => setAuthMode("providers")}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Login with Providers
              </button>
              <button
                onClick={() => setAuthMode("otp")}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Login with Mobile OTP
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Sign Up
              </button>
            </div>
          )}
          {authMode && authMode !== "providers" && (
            <button
              onClick={() => setAuthMode(null)} // Reset authMode to go back
              className="mt-4 w-full px-4 py-2 bg-gray-200 rounded text-center"
            >
              Back
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserModal;
 */

//mynextauth/src/components/userModal.js

/* 
"use client";

import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const UserModal = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Access the router object

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      
      <button
        onClick={toggleModal}
        className="flex items-center space-x-2 p-2 bg-gray-100 rounded-full hover:shadow-md focus:outline-none"
      >
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full">
            <span className="text-sm font-bold">
              {session?.user?.name?.[0] || "U"}
            </span>
          </div>
        )}
      </button>

      // {/* Modal }
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg z-50">
          <div className="p-4 border-b">
            {session ? (
              <div className="flex items-center space-x-3">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-bold">{session.user.name}</h3>
                  <p className="text-sm text-gray-500">{session.user.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Not signed in</p>
            )}
          </div>

          <div className="p-4 space-y-2">
            {session ? (
              <>
                <button
                  onClick={() => alert("Navigate to Profile")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
                >
                  View Profile
                </button>
                <button
                  onClick={() => alert("Settings")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
                >
                  Settings
                </button>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push("/auth/login")}
                className="w-full px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserModal;
 */
"use client";

import React, { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "../services/api";

const UserModal = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(null); // Role state
  const router = useRouter();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get("/api/role", {
          headers: { Authorization: `Bearer ${session?.jwtToken}` },
        });
        setRole(response.data.role);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    if (session?.jwtToken) {
      fetchRole();
    }
  }, [session]);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleModal}
        className="flex items-center space-x-2 p-2 bg-gray-100 rounded-full hover:shadow-md focus:outline-none"
      >
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full">
            <span className="text-sm font-bold">
              {session?.user?.name?.[0] || "U"}
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg z-50">
          <div className="p-4 border-b">
            {session ? (
              <div className="flex items-center space-x-3">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-bold">{session.user.name}</h3>
                  <p className="text-sm text-gray-500">{session.user.email}</p>
                  {role && <p className="text-xs text-gray-400">Role: {role}</p>}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Not signed in</p>
            )}
          </div>
          <div className="p-4 space-y-2">
            {session ? (
              <>
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
                >
                  View Profile
                </button>
                <button
                  onClick={() => router.push("/settings")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
                >
                  Settings
                </button>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push("/auth/login")}
                className="w-full px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserModal;
