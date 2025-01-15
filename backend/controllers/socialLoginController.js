// backend/controllers/socialLoginController.js

const { verifyGoogleToken } = require("../handlers/socialAuthService");
const { socialLogin } = require("../handlers/socialLoginHandler");

const socialLoginController = async (req, res) => {
  const { token, provider } = req.body;
  if (!token || !provider) {
    return res
      .status(400)
      .json({ message: "Token and provider are required." });
  }

  try {
    let payload;

    if (provider === "google") {
      payload = await verifyGoogleToken(token);
    } else {
      return res
        .status(400)
        .json({ message: `Provider ${provider} is not supported.` });
    }

    const { sub: providerAccountId, email, name, picture } = payload;

    const response = await socialLogin(provider, {
      providerAccountId,
      email,
      name,
      picture,
      token,
    },res); // Pass 'res' to set the cookie

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in social login controller:", error.message);
    res.status(500).json({ message: "Social login failed." });
  }
};
module.exports = { socialLoginController };
