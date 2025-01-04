//backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const  User  = require("../models/UserDetails/baseUser");
const Role = require("../models/UserDetails/role");
// Middleware to verify token and attach user and role to the request
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from the header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
      console.log("Decoded userId:", decoded.userId);

      // Check if decoded.userId is present
      if (!decoded.userId) {
        return res
          .status(400)
          .json({ message: "Invalid token, no userId found" });
      }

      // Fetch user and their role in a single query
      const user = await User.findById(decoded.userId).populate(
        "role",
        "name permissions"
      );
      console.log("in Protect user : ",user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user; // Attach user object, including populated role, to the request
      next();
    } catch (error) {
      console.error("Error in protect middleware:", error.message);
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized, no user found" });
  }

  if (req.user.role?.name === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};

// Middleware to check for specific roles
const verifyRole = (requiredRoles) => (req, res, next) => {
  if (!req.user?.role?.name || !requiredRoles.includes(req.user.role.name)) {
    return res.status(403).json({ message: "Access Forbidden" });
  }
  next();
};

// Middleware for subadmin role check
const verifySubadmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized, no user found" });
  }

  if (req.user.role?.name === "subadmin") {
    next();
  } else {
    res.status(403).json({ message: "Subadmin access required" });
  }
};

// Middleware to verify token and fetch user with permissions
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    const user = await User.findById(decoded.userId)
      .populate("role", "name permissions")
      .lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // Attach user to the request
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};

// Middleware to authorize based on roles or permissions
const authorize = (roles = [], requiredPermissions = []) => {
  return async (req, res, next) => {
    const { role, customPermissions } = req.user || {};
    if (!role)
      return res.status(401).json({ message: "Not authorized, no role found" });

    const effectivePermissions = {
      ...role.permissions,
      ...customPermissions,
    };

    // Check if user has the required role
    if (roles.length && !roles.includes(role.name)) {
      return res
        .status(403)
        .json({ message: "Access denied: Role not authorized" });
    }

    // Check if user has the required permissions
    const hasPermission = requiredPermissions.every(
      (perm) => effectivePermissions[perm]
    );
    if (!hasPermission) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions" });
    }

    next();
  };
};

module.exports = {
  protect,
  isAdmin,
  verifyRole,
  verifySubadmin,
  verifyToken,
  authorize,
};
