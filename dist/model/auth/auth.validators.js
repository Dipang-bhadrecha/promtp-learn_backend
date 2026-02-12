"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpSchema = exports.requestOtpSchema = void 0;
const zod_1 = require("zod");
exports.requestOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email()
});
exports.verifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    otp: zod_1.z.string().length(6)
});
