import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: process.env.BREVO_SMTP_PORT,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_API_KEY,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Brevo SMTP connection failed:", error);
  } else {
    console.log("Brevo SMTP server is ready to send emails!");
  }
});

export const sendEmail = async ({ to, subject, message }) =>
  new Promise(async (resolve, reject) => {
    try {
      const mailOptions = {
        from: process.env.BREVO_USER,
        to,
        subject,
        html: message,
      };

      await transporter.sendMail(mailOptions);
      resolve("Email sent successfully");
    } catch (error) {
      reject(error.message || "An error occurred sending email");
    }
  });
