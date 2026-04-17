import nodemailer from "nodemailer";

export const emailConfig = {
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.MAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
};

export const createTransporter = () => {
  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: emailConfig.auth,
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const mailOptions = {
  from: process.env.MAIL_FROM_NAME 
    ? `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_USERNAME}>` 
    : process.env.MAIL_USERNAME,
};