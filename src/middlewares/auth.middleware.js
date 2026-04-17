import { getCurrentUser, extractToken, verifyToken } from "../utils/helpers.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ status: 401, message: "No token provided" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ status: 401, message: "Invalid or expired token" });
    }

    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    if (!user.status) {
      return res.status(403).json({ status: 403, message: "Account is disabled" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ status: 500, message: "Authentication error" });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await getCurrentUser(req);
        if (user && user.status) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};

export const requireAdmin = async (req, res, next) => {
  if (!req.user || req.user.userRole !== 1n) {
    return res.status(403).json({ status: 403, message: "Admin access required" });
  }
  next();
};