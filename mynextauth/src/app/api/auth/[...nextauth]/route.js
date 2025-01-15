// src/pages/api/auth/[...nextauth].js

// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import apiClient from "../../../../services/apiClient"; // Axios setup
import { refreshAccessToken } from "../../../../utils/refreshTokenUtil";

// Helper function to check if the access token has expired
function checkIfTokenExpired(accessToken) {
  if (!accessToken) return true;
  const decodedToken = JSON.parse(Buffer.from(accessToken.split(".")[1], 'base64').toString('utf-8'));
  return decodedToken.exp * 1000 < Date.now(); // Compare expiry time with current time
}
// NextAuth configuration
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 10000, // Increase timeout for slow responses
      },
    }),
  ],
  callbacks: {
    // JWT callback to manage tokens
    async jwt({ token, account }) {
      if (account?.provider && account.id_token) {
        // Social login flow
        try {
          const response = await apiClient.post("/api/social-Auth/social-login", {
            skipAuth: true,
            token: account.id_token,
            provider: account.provider,
          });

          const { token: customToken, refreshToken, user: socialUser } = response.data;

          // Store tokens and user details
          token.accessToken = customToken || "";
          token.refreshToken = refreshToken || "";
          token.id = socialUser.id;
          token.role = socialUser?.role || "User";
          token.permissions = socialUser?.permissions || {};
          token.route = socialUser?.route || "/";
        } catch (error) {
          console.error(
            "Error during social login:",
            error.response?.data?.message || error.message
          );
          // Fallback values in case of an error
          token.role = "User";
          token.permissions = {};
          token.route = "/";
          token.accessToken = "";
        }
      }

      // Handle token expiration
      const isExpired = checkIfTokenExpired(token.accessToken);
      if (isExpired && token.refreshToken) {
        const newAccessToken = await refreshAccessToken(token.refreshToken);
        if (newAccessToken) {
          token.accessToken = newAccessToken;
        } else {
          console.error("Failed to refresh access token. User might need to log in again.");
        }
      }
      return token;
    },

    // Session callback to pass data to the client
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.permissions = token.permissions;
      session.user.route = token.route;
      session.accessToken = token.accessToken; // Include access token in session
      session.refreshToken = token.refreshToken; // Include refresh token in session
      return session;
    },
  },
  session: {
    strategy: "jwt", // Use JWT-based sessions
    maxAge: 24 * 60 * 60, // Tokens valid for 1 day
  },
};

// Export the handler for Next.js API routes
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };