// src/routes/auth.routes.ts
import { Router } from "express";
import { body } from "express-validator";
import * as authController from "../controller/auth.controller";

const router = Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("confirmPassword").exists().withMessage("confirmPassword is required"),
  ],
  authController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  authController.login
);

export default router;
