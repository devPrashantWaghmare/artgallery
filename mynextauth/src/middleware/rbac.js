import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const url = req.nextUrl;

  // Define role-based access restrictions
  
  const roleBasedRoutes = {
    SuperAdmin: '/superadmin/dashboard',
    Admin: '/admin/dashboard',
    SubAdmin: '/subadmin/dashboard',
    Artist: '/artist/dashboard',
    User: '/user/dashboard',
};

  for (const [route, requiredRoles] of Object.entries(roleBasedRoutes)) {
    if (url.pathname.startsWith(route)) {
      if (!token || !checkAccess(requiredRoles, token.role)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  // Allow access if no restrictions match
  return NextResponse.next();
}

/**
 * Checks if the user's role grants access to the required roles.
 * @param {string[]} requiredRoles - Array of roles allowed to access the route.
 * @param {string} userRole - The user's role.
 * @returns {boolean} True if the user has access, false otherwise.
 */
export const checkAccess = (requiredRoles, userRole) => {
  return requiredRoles.includes(userRole);
};
