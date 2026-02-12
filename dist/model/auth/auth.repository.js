"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
exports.AuthRepository = {
    async findByEmail(email) {
        const result = await db_1.default.query(`SELECT id, email, password, confirm_password, created_at
       FROM users 
       WHERE email = $1 
       LIMIT 1`, [email]);
        return result.rows[0] ?? null;
    },
    async createUser(email, password, confirm_password) {
        const result = await db_1.default.query(`INSERT INTO users (email, password, confirm_password)
       VALUES ($1, $2, $3)
       RETURNING id, email, password, confirm_password`, [email, password, confirm_password]);
        return result.rows[0];
    },
};
