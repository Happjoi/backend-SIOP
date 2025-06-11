// src/config/mailer.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();

interface TransportConfig {
  host: string;
  port: number;
  secure: boolean; // true p/ 465, false p/ outras portas
  auth: {
    user: string;
    pass: string;
  },

    tls: {
    rejectUnauthorized: false
  }
}

const transportConfig: TransportConfig = {
  host: process.env.SMTP_HOST || '',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, 
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },

    tls: {
    rejectUnauthorized: false
  }
  
};

const transporter = nodemailer.createTransport(transportConfig);

// Método helper para enviar e-mail
export async function sendEmail(
  to: string,
  subject: string,
  html: string | undefined,
  text: string | undefined
): Promise<void> {
  const from = process.env.EMAIL_FROM || '';
  await transporter.sendMail({ from, to, subject, html, text });
}

export default transporter;
