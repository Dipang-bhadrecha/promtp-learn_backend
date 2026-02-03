import { Request, Response } from "express";
import * as AuthService from "./auth.service";
import passport from "passport";

export async function requestOtp(req: Request, res: Response) {
  await AuthService.sendOtp(req.body.email);
  res.json({ message: "OTP sent" });
}

export async function verifyOtp(req: Request, res: Response) {
  const result = await AuthService.verifyOtp(req.body.email, req.body.otp);
  res.json(result);
}

// OAuth redirects
export function googleAuth(req: Request, res: Response) {
  passport.authenticate("google", { scope: ["email", "profile"] })(req, res);
}

export function googleCallback(req: Request, res: Response) {
  passport.authenticate("google", { session: false }, async (err, user) => {
    const result = await AuthService.handleOAuthLogin(user.email, "google");
    res.json(result);
  })(req, res);
}

export function githubAuth(req: Request, res: Response) {
  passport.authenticate("github", { scope: ["user:email"] })(req, res);
}

// export function githubCallback(req: Request, res: Response) {
//   passport.authenticate("github", { session: false }, async (err, user) => {
//     const result = await AuthService.handleOAuthLogin(user.email, "github");
//     res.json(result);
//   })(req, res);
// }
