const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (idToken) => {
  try {
    console.log("Verifying Google token:", idToken);  // Debug token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    return ticket.getPayload();
  } catch (error) {
    console.error("Error verifying Google token:", error.message);
    throw new Error("Invalid Google token.");
  }
};
module.exports = {verifyGoogleToken};