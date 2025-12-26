import pool from "../../config/db";
import { User } from "./auth.types";

export const AuthRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT id, email, password, confirm_password, created_at
       FROM users 
       WHERE email = $1 
       LIMIT 1`,
      [email]
    );
    return result.rows[0] ?? null;
  },

  async createUser(email: string, password: string, confirm_password: string): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (email, password, confirm_password)
       VALUES ($1, $2, $3)
       RETURNING id, email, password, confirm_password`,
      [email, password, confirm_password]
    );
    return result.rows[0];
  },
};
