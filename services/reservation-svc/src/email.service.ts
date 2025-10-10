/**
 * Email Service for Reservation Service
 * Sends notifications for reservation events
 */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
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
      console.log('📧 Reservation Service using Ethereal email for testing');
    }
  }

  async sendReservationCreated(
    email: string,
    reservationNumber: string,
    equipmentType: string,
    quantity: number,
    requestDate: Date,
  ) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"SaaS ITS" <noreply@saas-its.com>',
        to: email,
        subject: `Reservation Created: ${reservationNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reservation Request Submitted</h2>
            <p>Your equipment reservation has been created and is pending approval:</p>
            <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #4CAF50;">
              <strong>Reservation:</strong> ${reservationNumber}<br>
              <strong>Equipment:</strong> ${equipmentType}<br>
              <strong>Quantity:</strong> ${quantity}<br>
              <strong>Requested Date:</strong> ${requestDate.toLocaleDateString()}
            </div>
            <p>You'll be notified once your reservation is reviewed.</p>
            <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 12px;">SaaS ITS - IT Service Management</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send reservation created email:', error);
    }
  }

  async sendReservationApproved(
    email: string,
    reservationNumber: string,
    equipmentType: string,
    requestDate: Date,
    returnDate: Date,
  ) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"SaaS ITS" <noreply@saas-its.com>',
        to: email,
        subject: `Reservation Approved: ${reservationNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">Reservation Approved!</h2>
            <p>Great news! Your reservation has been approved:</p>
            <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #4CAF50;">
              <strong>Reservation:</strong> ${reservationNumber}<br>
              <strong>Equipment:</strong> ${equipmentType}<br>
              <strong>Pickup Date:</strong> ${requestDate.toLocaleDateString()}<br>
              <strong>Return Date:</strong> ${returnDate.toLocaleDateString()}
            </div>
            <p><strong>Next Steps:</strong> Please pick up your equipment on the scheduled date.</p>
            <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 12px;">SaaS ITS - IT Service Management</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send reservation approved email:', error);
    }
  }

  async sendReservationDenied(email: string, reservationNumber: string, reason: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"SaaS ITS" <noreply@saas-its.com>',
        to: email,
        subject: `Reservation Denied: ${reservationNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f44336;">Reservation Denied</h2>
            <p>Unfortunately, your reservation could not be approved:</p>
            <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #f44336;">
              <strong>Reservation:</strong> ${reservationNumber}<br>
              <strong>Reason:</strong> ${reason}
            </div>
            <p>Please contact support if you have questions or would like to submit a new request.</p>
            <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 12px;">SaaS ITS - IT Service Management</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send reservation denied email:', error);
    }
  }

  async sendReturnReminder(email: string, reservationNumber: string, returnDate: Date) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"SaaS ITS" <noreply@saas-its.com>',
        to: email,
        subject: `Return Reminder: ${reservationNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF9800;">Equipment Return Reminder</h2>
            <p>This is a reminder that your reserved equipment is due for return:</p>
            <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #FF9800;">
              <strong>Reservation:</strong> ${reservationNumber}<br>
              <strong>Return Date:</strong> ${returnDate.toLocaleDateString()}
            </div>
            <p>Please return the equipment on or before the due date to avoid late fees.</p>
            <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 12px;">SaaS ITS - IT Service Management</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send return reminder email:', error);
    }
  }
}

