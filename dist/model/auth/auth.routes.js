"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
// Email OTP
router.post("/request-otp", auth_controller_1.requestOtp);
router.post("/verify-otp", auth_controller_1.verifyOtp);
// Google OAuth
router.get("/google", auth_controller_1.googleAuth);
router.get("/google/callback", auth_controller_1.googleCallback);
// GitHub OAuth
router.get("/github", auth_controller_1.githubAuth);
// router.get("/github/callback", githubCallback);
exports.default = router;
