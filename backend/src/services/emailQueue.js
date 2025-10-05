import Bull from 'bull';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const emailQueue = new Bull('email', {
  redis: { host: 'redis', port: 6379 }
});

const transporter = nodemailer.createTransport({
  host: process.env.GMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

emailQueue.process(async (job) => {
  const { to, subject, text } = job.data;
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
});

export default emailQueue;