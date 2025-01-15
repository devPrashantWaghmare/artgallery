// backend/handlers/socialLoginHandler
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // For refresh token generation
const { User, Account } = require("../models/UserDetails/baseUser");
const Role = require("../models/UserDetails/role");
const {
  connectRedis,
  getUserFromCache,
  cacheUserData,
} = require("../utils/redisClient");

const socialLogin = async (provider, payload, res) => {
  if (
    !payload ||
    !payload.email ||
    !payload.providerAccountId ||
    !payload.token
  ) {
    throw new Error("Invalid payload structure.");
  }

  const { email, name, picture, providerAccountId, token } = payload;
  let user;

  try {
    // Connect to Redis
    await connectRedis();
    console.log("Connected to Redis successfully.");

    // Try to fetch the user from cache
    user = await getUserFromCache(`user:${email}`);
    if (!user) {
      console.log("User not found in cache. Fetching from DB.");
      user = await User.findOne({ email }).populate("role");

      if (!user) {
        console.log("User not found in DB. Creating a new user.");
        const defaultRole = await Role.findOne({ name: "User" });
        if (!defaultRole) {
          throw new Error("Default role 'User' not found.");
        }

        user = new User({
          name,
          email,
          avatar: picture,
          provider,
          role: defaultRole,
          userVersion: 1,
        });
        await user.save();
        console.log("New user created:", user);
      }

      // Cache the user data
      await cacheUserData(`user:${user._id}`, user.toObject()); // Cache by userId
      console.log("User data cached.");
    }

    // Update or create the associated account
    await Account.findOneAndUpdate(
      { user: user._id, provider },
      { providerAccountId, accessToken: token, lastLogin: new Date() },
      { upsert: true, new: true }
    );
    console.log("Account linked/updated successfully.");

    // Prepare token payload
    const tokenPayload = {
      userId: user._id.toString(),
      role: user.role.name,
      permissions: user.role.permissions,
      route: user.role.route,
      userVersion: user.userVersion || 1,
    };
// create jwt token in ` backend/handlers/socialLoginHandler`

    const customToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || "1h",
    });
    const refreshToken = crypto.randomBytes(40).toString("hex");
    await cacheUserData(`refreshToken:${user._id}`, refreshToken, 7 * 24 * 60 * 60); // Store in Redis for 7 days
      // Set HttpOnly cookie for refresh token
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
    return {
      token: customToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role.name,
        permissions: user.role.permissions,
        route: user.role.route,
      },
    };
  } catch (error) {
    console.error("Error during social login:", error.message);
    throw new Error("Social login failed.");
  }
};
module.exports = { socialLogin };
