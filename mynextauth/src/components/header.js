"use client";

import Link from "next/link";
import Image from "next/image";
import MainNav from "./main-nav";
import UserModal from "./userModal";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "../services/api";

export default function Header() {
  const { data: session } = useSession();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        if (session?.jwtToken) {
          const response = await axios.get("/api/role", {
            headers: { Authorization: `Bearer ${session.jwtToken}` },
          });
          setRole(response.data.role);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    fetchRole();
  }, [session]);

  return (
    <header className="sticky top-0 z-20 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.webp"
              alt="ArtGallery Logo"
              width={40}
              height={40}
              className="hover:opacity-80 transition-opacity"
            />
            <span className="ml-2 text-2xl font-bold text-blue-600 hover:text-blue-800 transition">
              ArtGallery
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <MainNav />

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {role && (
            <>
              {role === "admin"|| "superadmin" && (
                <Link
                  href="/admin/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Admin Dashboard
                </Link>
              )}
              {role === "user" && (
                <Link
                  href="/user/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  My Dashboard
                </Link>
              )}
            </>
          )}
          <UserModal />
        </div>
      </div>
    </header>
  );
}
