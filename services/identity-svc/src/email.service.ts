import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    // Initialize SendGrid with API key
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('✅ SendGrid Web API configured');
    } else {
      console.log('⚠️  SENDGRID_API_KEY not found');
    }
  }

  async sendOTP(email: string, otp: string) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SENDGRID_API_KEY not configured');
      }

      console.log('📧 Sending OTP to:', email);
      console.log('   From:', process.env.SMTP_FROM || 'noreply@saas-its.com');

      const msg = {
        to: email,
        from: process.env.SMTP_FROM || 'noreply@saas-its.com',
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
      };

      const result = await sgMail.send(msg);
      console.log('✅ OTP email sent successfully via SendGrid Web API');
      console.log('   Status:', result[0].statusCode);

      return result;
    } catch (error: any) {
      console.error('❌ Failed to send OTP email:', error);
      if (error.response) {
        console.error('   SendGrid Error:', error.response.body);
      }
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SENDGRID_API_KEY not configured');
      }

      const msg = {
        to: email,
        from: process.env.SMTP_FROM || 'noreply@saas-its.com',
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
      };

      const result = await sgMail.send(msg);
      console.log('✅ Welcome email sent successfully via SendGrid Web API');
      console.log('   Status:', result[0].statusCode);

      return result;
    } catch (error: any) {
      console.error('❌ Failed to send welcome email:', error);
      if (error.response) {
        console.error('   SendGrid Error:', error.response.body);
      }
      throw error;
    }
  }
}

