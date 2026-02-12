"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true only for port 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
// Verify connection once on startup
transporter.verify((err, success) => {
    if (err) {
        console.error("❌ Mailer connection failed", err);
    }
    else {
        console.log("✅ Mailer ready to send emails");
    }
});
async function sendEmail(to, subject, html) {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html
    });
}
