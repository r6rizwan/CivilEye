import jwt from "jsonwebtoken";

export const verifySuperAdminToken = (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: "Missing token" });
    }

    const secret = process.env.SUPER_ADMIN_JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ error: "Super admin not configured" });
    }

    try {
        const payload = jwt.verify(token, secret);
        if (payload?.role !== "SuperAdmin") {
            return res.status(403).json({ error: "Forbidden" });
        }
        req.superAdmin = payload;
        return next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};
