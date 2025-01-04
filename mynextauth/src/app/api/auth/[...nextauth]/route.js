import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import InstagramProvider from "next-auth/providers/instagram";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { redisClient } from "../../../../utils/redisNext";
import dbConnect from "../../../../lib/mongodb";

const requiredEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "FACEBOOK_CLIENT_ID",
  "FACEBOOK_CLIENT_SECRET",
  "INSTAGRAM_CLIENT_ID",
  "INSTAGRAM_CLIENT_SECRET",
  "NEXTAUTH_SECRET",
  "JWT_SIGNING_KEY",
];

// Validate environment variables
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Environment variable ${key} is missing.`);
   // throw new Error(`Environment variable ${key} is required.`);
  }
});

// Test MongoDB connection
const clientPromise = (async () => {
  try {
    const db = await dbConnect();
    console.log("MongoDB connected successfully.");
    return db.client; // Return the connected MongoDB client
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB.");
  }
})();

// Test Redis connection
(async () => {
  try {
    await redisClient.ping();
    console.log("Redis is connected successfully.");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    throw new Error("Redis connection failed.");
  }
})();
const facebookProvider =
  process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
    ? FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      })
    : null;

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    // }),
    ...(facebookProvider ? [facebookProvider] : []),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn Callback:", { user, account, profile });
      return true; // Return false to reject the sign-in
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect Callback:", { url, baseUrl });
      return baseUrl;
    },
    async session({ session, token }) {
      session.user.role = token.role || "user";
      session.user.token = token.token; // Pass the token to the session
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - User:", user);
      try {
        if (user) {
          // const redisKey = `user:role:${user.email}`;
          // let roleData = await redisClient.get(redisKey);

          token.role = user.role || "user";
          token.token = user.token || null; // Ensure this is being set
          
          if (!roleData) {
            const db = await dbConnect();
            const userData = await db.collection("users").findOne({ email: user.email });
            const role = userData?.role || "user";
            const version = userData?.userVersion || 1;
            roleData = JSON.stringify({ role, version });
            await redisClient.setEx(redisKey, 3600, roleData); // Cache role data
          }

          const parsedRoleData = JSON.parse(roleData);
          token.role = parsedRoleData.role;
          token.version = parsedRoleData.version;
        }

        return token;
      } catch (error) {
        console.error("Error in JWT callback:", error);
        throw error;
      }
    },
    async session({ session, token }) {
      console.log("Session Callback - Token:", token);
      console.log("Session Callback - Session before:", session);
      try {
        if (token) {
          session.user.role = token.role || "user";
          session.user.token = token.token || null;
          session.user.version = token.version || 1;
        }
        console.log("Session Callback - Session after:", session);

        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        throw error;
      }
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    signingKey: process.env.JWT_SIGNING_KEY,
  },
  pages: {
    signIn: "/auth/login", // Custom sign-in page
    error: "/auth/error", // Custom error page
  },
};

// Define the handler for GET and POST requests for NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
