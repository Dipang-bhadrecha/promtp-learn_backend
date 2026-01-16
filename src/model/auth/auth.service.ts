import db from "../../config/db"; 
import bcrypt from "bcrypt";
import { sendEmail } from "../../middleware/utils/mailer";

export async function sendOtp(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpHash = await bcrypt.hash(otp, 10);
  const expires = new Date(Date.now() + 5 * 60 * 1000);

  await db.query("DELETE FROM otp_tokens WHERE email=$1", [email]);

  await db.query(
    "INSERT INTO otp_tokens(email, otp_hash, expires_at) VALUES ($1,$2,$3)",
    [email, otpHash, expires]
  );

  await sendEmail(email, "Your OTP", `Your OTP is ${otp}`);
}

export async function verifyOtp(email: string, otp: string) {
  const result = await db.query(
    "SELECT * FROM otp_tokens WHERE email=$1",
    [email]
  );

  if (!result.rowCount) {
    throw new Error("OTP expired");
  }

  const record = result.rows[0];

  if (new Date(record.expires_at) < new Date()) {
    throw new Error("OTP expired");
  }

  const valid = await bcrypt.compare(otp, record.otp_hash);
  if (!valid) {
    throw new Error("Invalid OTP");
  }

  await db.query("DELETE FROM otp_tokens WHERE email=$1", [email]);

  return await handleUserLogin(email, "email");
}

// Shared for OAuth + Email
async function handleUserLogin(email: string, provider: string) {
  const userRes = await db.query("SELECT * FROM users WHERE email=$1", [email]);

  // New user
  if (!userRes.rowCount) {
    const username = email.split("@")[0];

    const newUser = await db.query(
      "INSERT INTO users(email, username, auth_provider) VALUES ($1,$2,$3) RETURNING *",
      [email, username, provider]
    );

    return {
      message: `Welcome ${username}`,
      user: newUser.rows[0]
    };
  }

  // Existing user
  const user = userRes.rows[0];

  await db.query(
    "UPDATE users SET last_login = now() WHERE id=$1",
    [user.id]
  );

  return {
    message: `Welcome back ${user.username}`,
    user
  };
}

export async function handleOAuthLogin(email: string, provider: string) {
  return await handleUserLogin(email, provider);
}
