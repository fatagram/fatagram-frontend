import { port, protectedRoutes, authRoutes } from "../config.js";

/**
 * Check if URL matches a route pattern
 */
function matchesRoute(url, route) {
  return url === route || url.startsWith(route + "/") || url.startsWith(route + "?");
}

/**
 * Handle server-side route protection and redirects
 * @returns {boolean} true if redirected, false if should continue rendering
 */
export function handleRouteProtection(url, authResult, res) {
  const { isAuthenticated } = authResult;

  console.log("[ROUTE] URL:", url, "| isAuthenticated:", isAuthenticated);

  const isProtectedRoute = protectedRoutes.some((route) => matchesRoute(url, route));
  const isAuthRoute = authRoutes.some((route) => matchesRoute(url, route));

  console.log("[ROUTE] isProtectedRoute:", isProtectedRoute, "| isAuthRoute:", isAuthRoute);

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    res.redirect(302, `/login?returnTo=${url}`);
    return true;
  }
  // Redirect authenticated users from auth routes
  if (isAuthRoute && isAuthenticated) {
    res.redirect(302, "/");
    return true;
  }

  // No redirect needed, continue rendering
  return false;
}
