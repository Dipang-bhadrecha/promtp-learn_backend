// src/service/auth.service.ts
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "../model/user.model";
import { signAccessToken, signRefreshToken } from "../utils/token.util";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: { id: number; email: string };
}

export const registerService = async (email: string, password: string) => {
  const normalized = email.trim().toLowerCase();
  const existing = await findUserByEmail(normalized);
  if (existing) {
    const err: any = new Error("Email already registered");
    err.status = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser(normalized, hashed);
  return user;
};

export const loginService = async (email: string, password: string): Promise<AuthResult> => {
  const normalized = email.trim().toLowerCase();
  const user = await findUserByEmail(normalized);
  if (!user) {
    const err: any = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    const err: any = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const payload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email },
  };
};
