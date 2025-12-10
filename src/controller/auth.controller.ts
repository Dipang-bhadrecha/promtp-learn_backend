// src/controller/auth.controller.ts
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import * as authService from "../service/auth.service";

// Registration 
export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, confirmPassword } = req.body as {
    email: string;
    password: string;
    confirmPassword: string;
  };

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const user = await authService.registerService(email, password);
    return res.status(201).json({ message: "User registered", user });
  } catch (err: any) {
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || "Internal server error" });
  }
};

// Login 
export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body as { email: string; password: string };

  try {
    const result = await authService.loginService(email, password);
    // In production consider setting refresh token as an HttpOnly cookie and returning only access token
    return res.json({
      message: "Logged in",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (err: any) {
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || "Internal server error" });
  }
};
