import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async (to, subject, html) => {
  try {
    //  Debug Logs
    console.log("Mailtrap Debug Info:");
    console.log({
      MAILTRAP_HOST: process.env.MAILTRAP_HOST,
      MAILTRAP_PORT: process.env.MAILTRAP_PORT,
      MAILTRAP_USER: process.env.MAILTRAP_USER ? " Loaded" : " Missing",
      MAILTRAP_PASS: process.env.MAILTRAP_PASS ? " Loaded" : " Missing",
    });

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
      port: process.env.MAILTRAP_PORT || 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    // Send mail
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Wireframe Support" <support@wireframeapp.com>',
      to,
      subject,
      html,
    });

    console.log(` Mail sent to: ${to} | Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Mail sending failed: " + error.message);
  }
};

export default sendMail;
