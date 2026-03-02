import axios from "axios";
import "dotenv/config";

export async function auth(req, res) {
  try {
    await axios.get(`${process.env.VITE_API_URL}/api/v1/auth/ping`, {
      headers: { Cookie: req.headers.cookie || "" },
      withCredentials: true,
    });

    return { isAuthenticated: true, refreshedCookie: null };
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
        let refreshedCookie = req.headers.cookie || "";
        if (setCookieHeaders) {
          setCookieHeaders.forEach((c) => {
            res.append("Set-Cookie", c);
          });
          // Build cookie string from Set-Cookie headers for subsequent server-side requests
          const newCookies = setCookieHeaders.map((c) => c.split(";")[0]).join("; ");
          refreshedCookie = newCookies;
        }

        return { isAuthenticated: true, refreshedCookie };
      } catch (refreshErr) {
        console.log("Refresh token failed, treating as guest");
        return { isAuthenticated: false, refreshedCookie: null };
      }
    }

    return { isAuthenticated: false, refreshedCookie: null };
  }
}
