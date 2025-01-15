//src/components/userModal.js

"client";

import React, { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "../services/api";

const UserModal = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

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
            alt={session?.user?.name || "User"}

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
                  {session.user.role && (
                    <p className="text-xs text-gray-400">
                       Role: {session?.user?.role || "User"}
                    </p>
                  )}
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
                  onClick={() => signOut({ callbackUrl: "/" })}
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
