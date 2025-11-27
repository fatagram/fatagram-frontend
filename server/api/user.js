import axios from "axios";
import "dotenv/config";

export async function user(req) {
  try {
    const user = await axios.get(`${process.env.VITE_API_URL}/api/UserProfile/me`, {
      headers: { Cookie: req.headers.cookie || "" },
      withCredentials: true,
    });

    return user.data?.data?.infos;
  } catch (error) {
    return null;
  }
}
