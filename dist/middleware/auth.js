"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jwt_1 = require("../middleware/utils/jwt");
const auth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header)
        return res.status(401).json({ error: "Unauthorized" });
    const token = header.split(" ")[1];
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid token" });
    }
};
exports.auth = auth;
