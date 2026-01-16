import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
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
  } else {
    console.log("✅ Mailer ready to send emails");
  }
});

export async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html
  });
}
