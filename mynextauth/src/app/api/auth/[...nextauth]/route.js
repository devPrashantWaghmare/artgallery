// src/pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "../../../../services/api";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
      httpOptions: {
        timeout: 10000, // Increase to 10 seconds
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // If it's the first time the user is logging in, store the user's role
      if (account && profile) {
        try {
          // Send the token to your backend to fetch user details
          const response = await axios.post("/api/auth/social-login", {
            token: account.id_token, // Pass the social login token (from Google)
            provider: "google", // Specify the provider (google)
          });

          const user = response.data.user;

          // Add the user role to the JWT token
          token.role = user.role || "User"; // Default to "User" if no role is found
          token.permissions = user.permissions || {}; // Ensure permissions are always set
          token.route = user.route || "/"; // Default route if not provided
        } catch (error) {
          console.error("Error in JWT callback during social login:", error);
          // Fallback to default token in case of error
          token.role = "User";
          token.permissions = {};
          token.route = "/";
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Add the role and permissions from the token to the session object
      session.user.role = token.role;
      session.user.permissions = token.permissions || {}; // Ensure permissions are set
      session.user.route = token.route; // Optional: Store user-specific route
      return session;
    },
  },
  session: {
    strategy: "jwt", // Use JWT tokens to store session data
  },
};
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
