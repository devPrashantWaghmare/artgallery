const jwt = require("jsonwebtoken");
const { getUserFromCache } = require("../utils/redisClient");

const refreshTokenController = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found." });
  }

  try {
    const user = await getUserFromCache(`refreshToken:${refreshToken}`);
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    const newAccessToken = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || "1h",
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: "Failed to refresh token." });
  }
};

module.exports = { refreshTokenController };
