"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = sendOtp;
exports.verifyOtp = verifyOtp;
exports.handleOAuthLogin = handleOAuthLogin;
const db_1 = __importDefault(require("../../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mailer_1 = require("../../middleware/utils/mailer");
const jwt_1 = require("../../middleware/utils/jwt");
async function sendOtp(email) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt_1.default.hash(otp, 10);
    const expires = new Date(Date.now() + 5 * 60 * 1000);
    await db_1.default.query("DELETE FROM otp_tokens WHERE email=$1", [email]);
    await db_1.default.query("INSERT INTO otp_tokens(email, otp_hash, expires_at) VALUES ($1,$2,$3)", [email, otpHash, expires]);
    await (0, mailer_1.sendEmail)(email, "Your OTP", `Your OTP is ${otp}`);
}
async function verifyOtp(email, otp) {
    const result = await db_1.default.query("SELECT * FROM otp_tokens WHERE email=$1", [email]);
    if (!result.rowCount)
        throw new Error("OTP expired");
    const record = result.rows[0];
    if (new Date(record.expires_at) < new Date())
        throw new Error("OTP expired");
    const valid = await bcrypt_1.default.compare(otp, record.otp_hash);
    if (!valid)
        throw new Error("Invalid OTP");
    await db_1.default.query("DELETE FROM otp_tokens WHERE email=$1", [email]);
    // 🔥 returns { message, user, token }
    return await handleUserLogin(email, "email");
}
// Shared for OAuth + Email
async function handleUserLogin(email, provider) {
    const userRes = await db_1.default.query("SELECT * FROM users WHERE email=$1", [email]);
    let user;
    // New user
    if (!userRes.rowCount) {
        const username = email.split("@")[0];
        const newUser = await db_1.default.query("INSERT INTO users(email, username, auth_provider) VALUES ($1,$2,$3) RETURNING *", [email, username, provider]);
        user = newUser.rows[0];
    }
    // Existing user
    else {
        user = userRes.rows[0];
        await db_1.default.query("UPDATE users SET last_login = now() WHERE id=$1", [user.id]);
    }
    // 🔐 Generate JWT here
    const token = (0, jwt_1.signToken)(user);
    return {
        message: userRes.rowCount ? `Welcome back ${user.username}` : `Welcome ${user.username}`,
        user,
        token
    };
}
async function handleOAuthLogin(email, provider) {
    return await handleUserLogin(email, provider);
}
