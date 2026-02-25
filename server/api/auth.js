import axios from "axios";
import "dotenv/config";

export async function auth(req, res) {
  try {
    await axios.get(`${process.env.VITE_API_URL}/api/v1/auth/ping`, {
      headers: { Cookie: req.headers.cookie || "" },
      withCredentials: true,
    });

    return { isAuthenticated: true };
  } catch (err) {
    if (err.response?.status === 401) {
      try {
        const refreshRes = await axios.post(
          `${process.env.VITE_API_URL}/api/v1/auth/refreshToken`,
          {},
          {
            headers: { Cookie: req.headers.cookie || "" },
            withCredentials: true,
          },
        );

        const setCookieHeaders = refreshRes.headers["set-cookie"];
        if (setCookieHeaders) {
          setCookieHeaders.forEach((c) => {
            res.append("Set-Cookie", c);
          });
        }

        return { isAuthenticated: true };
      } catch (refreshErr) {
        console.log("Refresh token failed, treating as guest");
        return { isAuthenticated: false };
      }
    }

    return { isAuthenticated: false };
  }
}
