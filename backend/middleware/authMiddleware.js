//backend/middleware/authMiddleware.js

const { getUserFromCache, cacheUserData } = require('../utils/redisClient');
const { User } = require('../models/UserDetails/baseUser');
const jwt = require('jsonwebtoken');
const Role = require("../models/UserDetails/role");
const redis = require("ioredis");

// Middleware to verify token and attach user and role to the request
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("in protect : decoded : ",decoded);
    const { userId, userVersion } = decoded; // Extract role version and userId from JWT

    const cachedUser = await getUserFromCache(`user:${userId}`);
    if (cachedUser) {
      if (cachedUser.userVersion === userVersion) {
        req.user = cachedUser;
        return next();
      }
      // Version mismatch; refresh from DB
      const freshUser = await User.findById(userId).populate('role', 'name permissions version').lean();
      if (!freshUser) return res.status(404).json({ message: 'User not found' });
      
      await cacheUserData(`user:${userId}`, freshUser); // Update cache
      req.user = freshUser;
      return next();
    }
    
    // Cache miss; Fetch from DB
    const user = await User.findById(userId).populate('role', 'name permissions version').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    await cacheUserData(`user:${userId}`, user); // Cache for future
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

// Middleware to check if the user has a specific role
const hasRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role.name !== role) {
    return res.status(403).json({ message: `${role} access required` });
  }
  next();
};

// Middleware to check if user has any of the required roles
const hasRoles = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role.name)) {
    return res.status(403).json({ message: 'Access Forbidden' });
  }
  next();
};




// Middleware to check for specific roles
const verifyRole = (requiredRoles) => (req, res, next) => {
  if (!req.user?.role?.name || !requiredRoles.includes(req.user.role.name)) {
    return res.status(403).json({ message: "Access Forbidden" });
  }
  next();
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
const checkPermission = (requiredPermissions) => (req, res, next) => {
  const { permissions } = req.user;
  const hasAllPermissions = requiredPermissions.every((perm) => permissions[perm]);
  if (!hasAllPermissions) {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
  next();
};

 module.exports = {
  protect,
  hasRole,
  hasRoles,

  verifyRole,

  authorize,
  checkPermission,
};
