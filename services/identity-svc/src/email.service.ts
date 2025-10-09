import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter!: nodemailer.Transporter;

  constructor() {
    // For development, use Ethereal (fake SMTP)
    // For production, use real SMTP (Gmail, SendGrid, AWS SES, etc.)
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      // Production SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Development: Use Ethereal (fake SMTP for testing)
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('📧 Using Ethereal email for testing');
      console.log('   User:', testAccount.user);
    }
  }

  async sendOTP(email: string, otp: string) {
    const info = await this.transporter.sendMail({
      from: process.env.SMTP_FROM || '"SaaS ITS" <noreply@saas-its.com>',
      to: email,
      subject: 'Your Login Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Login Code</h2>
          <p>Use the following code to log in to your account:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px;">SaaS ITS - IT Service Management</p>
        </div>
      `,
    });

    console.log('📧 OTP email sent:', info.messageId);
    if (process.env.NODE_ENV !== 'production') {
      console.log('   Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  }

  async sendWelcomeEmail(email: string, name: string) {
    const info = await this.transporter.sendMail({
      from: process.env.SMTP_FROM || '"SaaS ITS" <noreply@saas-its.com>',
      to: email,
      subject: 'Welcome to SaaS ITS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to SaaS ITS!</h2>
          <p>Hi ${name || 'there'},</p>
          <p>Your account has been created successfully. You can now log in using email OTP authentication.</p>
          <p>Thank you for joining us!</p>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px;">SaaS ITS - IT Service Management</p>
        </div>
      `,
    });

    console.log('📧 Welcome email sent:', info.messageId);
    return info;
  }
}

