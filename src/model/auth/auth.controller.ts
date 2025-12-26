import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.validators";

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await AuthService.register(data);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await AuthService.login(data);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
