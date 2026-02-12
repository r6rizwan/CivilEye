import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const requireRole = (roles = []) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  return next();
};

export const requireSelfEmailOrRole = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  if (allowedRoles.includes(req.user.role)) {
    return next();
  }

  const paramEmail = (req.params.email || "").toLowerCase();
  const userEmail = (req.user.email || "").toLowerCase();

  if (paramEmail && userEmail && paramEmail === userEmail) {
    return next();
  }

  return res.status(403).json({ error: "Forbidden" });
};

export const requireSelfIdOrRole = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  if (allowedRoles.includes(req.user.role)) {
    return next();
  }

  const paramId = req.params.id;
  const userId = req.user.id;

  if (paramId && userId && paramId === userId) {
    return next();
  }

  return res.status(403).json({ error: "Forbidden" });
};
