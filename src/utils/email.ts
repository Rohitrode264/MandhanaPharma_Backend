import nodemailer from 'nodemailer';
import { env } from '../config/env';

export const sendEmail = async (options: { email: string; subject: string; message: string; html?: string }) => {
  const transporter = nodemailer.createTransport({
    host: env.email.smtpHost,
    port: env.email.smtpPort,
    auth: {
      user: env.email.smtpUser,
      pass: env.email.smtpPass,
    },
  });

  const mailOptions = {
    from: `${env.email.fromEmail}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};
