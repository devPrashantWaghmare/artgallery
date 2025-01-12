const { User, Account } = require("../models/UserDetails/baseUser");
const Role = require("../models/UserDetails/role");
console.log(Role);
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const Redis = require("ioredis");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Singleton Redis Client
let redisClient;
(async () => {
  if (!redisClient) {
    redisClient = new Redis(); // Connect to Redis
    redisClient.on("connect", () => {
      console.log("✅ Connected to Redis Server!");
    });
    redisClient.on("error", (err) => {
      console.error("❌ Error Connecting to Redis Server: ", err);
    });
  }
})();

exports.socialLogin = async (req, res) => {
  const { token, provider } = req.body;

  if (!token || !provider) {
    console.log("Error: Missing token or provider");
    return res.status(400).json({ message: "Token and provider are required" });
  }

  try {
    let user, account;

    if (provider === "google") {
      console.log("Provider is Google");

      // Verify Google ID token
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const { sub: providerAccountId, email, name, picture } = ticket.getPayload();
      console.log("Google payload:", { email, name, picture });

      // Check Redis cache
      let cachedUser = await redisClient.get(`user:${email}`);
      console.log("Cached user from Redis:", cachedUser);

      if (cachedUser) {
        user = JSON.parse(cachedUser);
      } else {
        console.log("User not found in Redis, checking database");

        // Find user in database
        user = await User.findOne({ email }).populate("role");
        console.log("User fetched from DB:", user);

        if (!user) {
          console.log("User not found in DB, creating new user");

          console.log("Checking if Role is defined:", Role);
          const role = await Role.findOne({ name: "User" });
          console.log("Role fetched from database:", role);
          

          if (!role) {
            console.log("Role 'User' not found in DB");
            throw new Error("Default role 'User' not found.");
          }

          user = new User({ name, email, avatar: picture, provider, role: role._id });
          await user.save();

          console.log("New user created:", user);

          // Cache new user
          await redisClient.set(`user:${email}`, JSON.stringify(user.toObject()), "EX", 3600);
        } else {
          console.log("User found in DB, caching user");
          await redisClient.set(`user:${email}`, JSON.stringify(user.toObject()), "EX", 3600);
        }
      }

      // Update or create account
      account = await Account.findOneAndUpdate(
        { user: user._id, provider },
        { providerAccountId, accessToken: token, lastLogin: new Date() },
        { upsert: true, new: true }
      );
      console.log("Account updated/created:", account);
    }

    // Create JWT token
    const tokenPayload = {
      userId: user._id.toString(),
      role: user.role.name,
      permissions: user.role.permissions,
      route: user.role.route,
      userVersion: user.userVersion || 1,
    };
    const customToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || "1h",
    });

    console.log("Login successful, returning response");

    res.status(200).json({
      token: customToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role.name,
        permissions: user.role.permissions,
        route: user.role.route,
      },
    });
  } catch (error) {
    console.error("Social login error:", error);
    res.status(500).json({ message: "Social login failed" });
  }
};
// the above code is working fine. Will this code work for other login providers like facebook, instagram, apple?


/* Server running on http://localhost:5000
✅ Connected to Redis Server!
MongoDB connected successfully
Default roles created successfully
Super Admin already exists 
Provider is Google
Google payload: {
  email: 'poojaw961@gmail.com',
  name: 'Pooja Waghmare',  
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocK3Tl_CNWynyvtTU0xIZQ6qHT-0Gw977DePeq2I54cIcdDXVrwv=s96-c'
}
Cached user from Redis: null
User not found in Redis, checking database
User fetched from DB: null
User not found in DB, creating new user
Checking if Role is defined: Model { Role }
Role fetched from database: {
  _id: new ObjectId('677945469be06a69a9977ab1'),      
  name: 'User',
  permissions: {
    manageUsers: false,    
    manageRoles: false,    
    monitorActivities: false,
    accessReports: false,  
    systemMaintenance: false,
    canOnboardArtists: false,
    canOfferDiscounts: false,
    canManageProducts: false,
    canVerifyUsers: false, 
    canManageOrders: false,
    canManageTransactions: false,
    canManagePayments: false,
    _id: new ObjectId('677945469be06a69a9977ab2')     
  },
  route: '/user/dashboard',
  __v: 0
}
New user created: {
  name: 'Pooja Waghmare',  
  email: 'poojaw961@gmail.com',
  mobile: '',
  role: new ObjectId('677945469be06a69a9977ab1'),     
  userVersion: 1,
  otpVerified: false,      
  _id: new ObjectId('6783f376e1814d721c979ffe'),      
  linkedAccounts: [],      
  createdAt: 2025-01-12T16:53:10.996Z,
  updatedAt: 2025-01-12T16:53:10.996Z,
  __v: 0
}
Account updated/created: {
  _id: new ObjectId('6783f37743162b0549410569'),      
  provider: 'google',      
  user: new ObjectId('6783f376e1814d721c979ffe'),     
  __v: 0,
  accessToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg5Y2UzNTk4YzQ3M2FmMWJkYTRiZmY5NWU2Yzg3MzY0NTAyMDZmYmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDgzODU2MTA0MTE3LW45NGVoMjJubTFzOGpqZ2g3NWh2cXUxdWsxb2Q1cmhlLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTA4Mzg1NjEwNDExNy1uOTRlaDIybm0xczhqamdoNzVodnF1MXVrMW9kNXJoZS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzA0MzU3MDExODkyNDM4MzkyMiIsImVtYWlsIjoicG9vamF3OTYxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiMVJwQlF0Y1Rwby1KTzhzNDF1X2hrUSIsIm5hbWUiOiJQb29qYSBXYWdobWFyZSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLM1RsX0NOV3lueXZ0VFUweElaUTZxSFQtMEd3OTc3RGVQZXEySTU0Y0ljZERYVnJ3dj1zOTYtYyIsImdpdmVuX25hbWUiOiJQb29qYSIsImZhbWlseV9uYW1lIjoiV2FnaG1hcmUiLCJpYXQiOjE3MzY3MDA3ODksImV4cCI6MTczNjcwNDM4OX0.jODrJNrcZ8egBFKTKgJDT2Ow5rSFncdbPk_Fll7f294dT5pUvvlUjeVsO37Iv5kcRNwCz1wDQcSZDz-oMJJQykZ3WO1Z8F0VWuz-cr0gLs_p1gk_NTuRW27n8i5hqiDY6MZaojymKaUIWb5WytuhYbVTvx0FOWUKw2xWTd-41rUkmeTPC3mDb89WOLl6x0Y1v615_Oznuz5mvV0bBgV123LmGcWfYoaOvobnpE9AL3QFwVlG3Dy7lQjKLrGb0xYgBbPKZ5G8H5GWdyAWcRX_MxteQnnRwP9HNRHChU8wFAuM3rV8u5e3df_njdOjU0AOLsrGc7QoCwmKwse3uZ6WxQ',
  createdAt: 2025-01-12T16:53:11.025Z,
  lastLogin: 2025-01-12T16:53:11.022Z,
  otpVerified: false,      
53:11.025Z
53:11.025Z
}
Login successful, returning response
*/