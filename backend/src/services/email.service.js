import { config } from "../config/config.js";
import nodemailer from "nodemailer";

/**
 * @function transporter
 * @description Creates a nodemailer transporter object using the email configuration from the config file
 * @returns {Object} A nodemailer transporter object configured with the email service, user, and password
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: config.GOOGLE_USER,
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    refreshToken: config.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server: ", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

/**
 * @function sendEmail
 * @description Sends an email using the nodemailer transporter object
 * @param {string} to - The recipient's email address
 * @param {string} subject - The subject of the email
 * @param {string} text - The plain text content of the email
 * @param {string} html - The HTML content of the email
 * @returns {Promise} A promise that resolves when the email is sent successfully, or rejects with an error if there is a problem sending the email.
 */
export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Brick Nest App" <${config.GOOGLE_USER}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
