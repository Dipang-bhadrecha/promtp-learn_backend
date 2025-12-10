// src/model/user.model.ts
import pool from "../config/db";

export interface UserRow {
  id: number;
  email: string;
  password: string;
  confirmPassword: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export const findUserByEmail = async (email: string): Promise<UserRow | null> => {
  const res = await pool.query<UserRow>("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0] ?? null;
};

export const createUser = async (email: string, password: string, confirmPassword: string) => {
  const res = await pool.query<{ id: number; email: string; created_at: string }>(
    `INSERT INTO users (email, password, confirm_password) VALUES ($1, $2, $3) 
        RETURNING id, email, password, confirm_password, created_at`,
    [email, password, confirmPassword]
  );
  return res.rows[0];
};
