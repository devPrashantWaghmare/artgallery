"use client";

import Link from "next/link";

export default function MainNav() {
  return (
    <nav className="hidden md:flex space-x-6">
      <Link
        href="/"
        className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
      >
        Home
      </Link>
      <Link
        href="/artworks"
        className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
      >
        Artworks
      </Link>
      <Link
        href="/artists"
        className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
      >
        Artists
      </Link>
      <Link
        href="/contact"
        className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
      >
        Contact
      </Link>
    </nav>
  );
}
