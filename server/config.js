// Server configuration constants
export const isProduction = process.env.NODE_ENV === "production";
export const port = process.env.PORT || 3000;
export const base = process.env.BASE || "/";
export const ABORT_DELAY = 10000;

// Route definitions
export const protectedRoutes = ["notifications", "settings", "friends", "fatalk"];
export const authRoutes = ["login", "register", "auth/google/callback"];
