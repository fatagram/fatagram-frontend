import axios from "axios";
import "dotenv/config";

export async function user(req, refreshedCookie) {
  try {
    // Use refreshed cookies if available (after token refresh), otherwise use original
    const cookieHeader = refreshedCookie || req.headers.cookie || "";
    const user = await axios.get(`${process.env.VITE_API_URL}/api/v1/UserProfile/me`, {
      headers: { Cookie: cookieHeader },
      withCredentials: true,
    });

    return user.data?.data?.infos;
  } catch (error) {
    return null;
  }
}
