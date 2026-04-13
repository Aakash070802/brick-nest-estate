import nodemailer from "nodemailer";
import { config } from "../config/config.js";

/**
 * Create transporter (lazy, reusable)
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.GOOGLE_USER,
      pass: config.GOOGLE_PASS,
    },
  });
};

/**
 * Verify transporter (optional but useful for startup checks)
 */
export const verifyEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email server is ready");
  } catch (error) {
    console.error("❌ Email server connection failed:", error.message);
  }
};

/**
 * Send email with retry logic
 */
export const sendEmail = async ({ to, subject, text, html, retries = 3 }) => {
  const transporter = createTransporter();

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const info = await transporter.sendMail({
        from: `"Brick Nest" <${config.GOOGLE_USER}>`,
        to,
        subject,
        text,
        html,
      });

      console.log(`📨 Email sent (attempt ${attempt}):`, info.messageId);
      return info;
    } catch (error) {
      console.error(`❌ Email failed (attempt ${attempt}):`, error.message);

      if (attempt === retries) {
        throw new Error("Email failed after multiple attempts");
      }

      // simple delay before retry
      await new Promise((res) => setTimeout(res, 1000 * attempt));
    }
  }
};
