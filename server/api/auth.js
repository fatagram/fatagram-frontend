import axios from "axios";
import "dotenv/config";

export async function checkAuth(cookieHeader) {
  if (!cookieHeader) {
    return { isAuthenticated: false, refreshedCookie: null, setCookieHeaders: null };
  }

  try {
    await axios.get(`${process.env.VITE_API_URL}/api/v1/auth/ping`, {
      headers: { Cookie: cookieHeader },
      withCredentials: true,
    });

    return { isAuthenticated: true, refreshedCookie: null, setCookieHeaders: null };
  } catch (err) {
    if (err.response?.status === 401) {
      try {
        const refreshRes = await axios.post(
          `${process.env.VITE_API_URL}/api/v1/auth/refresh-token`,
          {},
          {
            headers: { Cookie: cookieHeader },
            withCredentials: true,
          },
        );

        const setCookieHeaders = refreshRes.headers["set-cookie"];
        let refreshedCookie = cookieHeader;
        if (setCookieHeaders) {
          const newCookies = setCookieHeaders.map((c) => c.split(";")[0]).join("; ");
          refreshedCookie = newCookies;
        }

        return {
          isAuthenticated: true,
          refreshedCookie,
          setCookieHeaders: setCookieHeaders || null,
        };
      } catch (refreshErr) {
        console.log("Refresh token failed, treating as guest");
        return { isAuthenticated: false, refreshedCookie: null, setCookieHeaders: null };
      }
    }

    return { isAuthenticated: false, refreshedCookie: null, setCookieHeaders: null };
  }
}

export async function auth(req, res) {
  const result = await checkAuth(req.headers.cookie || "");

  if (result.setCookieHeaders) {
    result.setCookieHeaders.forEach((c) => {
      res.append("Set-Cookie", c);
    });
  }

  return result;
}
