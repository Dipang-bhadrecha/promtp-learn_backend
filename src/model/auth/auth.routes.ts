import { Router } from "express";
import {requestOtp,verifyOtp,googleAuth,googleCallback,githubAuth,
} from "./auth.controller";

const router = Router();

// Email OTP
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);

// Google OAuth
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// GitHub OAuth
router.get("/github", githubAuth);
// router.get("/github/callback", githubCallback);

export default router;
