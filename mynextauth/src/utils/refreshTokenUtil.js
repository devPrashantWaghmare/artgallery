import refreshApiClient from '../services/refreshApiClient';

// Helper function to refresh the access token using the refresh token
export async function refreshAccessToken(refreshToken) {
  try {
    const response = await refreshApiClient.post("/api/token/refresh-token", { refreshToken });
    const { accessToken } = response.data;
    return accessToken; // Return the new access token
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
}