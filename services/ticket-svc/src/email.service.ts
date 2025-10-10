/**
 * Email Service for Ticket Service
 * Sends notifications for ticket events
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
      console.log('📧 Ticket Service using Ethereal email for testing');
    }
  }

  async sendTicketCreated(email: string, ticketNumber: string, title: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"SaaS ITS" <noreply@saas-its.com>',
        to: email,
        subject: `Ticket Created: ${ticketNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Ticket Created Successfully</h2>
            <p>Your support ticket has been created:</p>
            <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #4CAF50;">
              <strong>Ticket Number:</strong> ${ticketNumber}<br>
              <strong>Title:</strong> ${title}
            </div>
            <p>We'll update you as your ticket progresses.</p>
            <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 12px;">SaaS ITS - IT Service Management</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send ticket created email:', error);
    }
  }

  async sendTicketStatusUpdate(email: string, ticketNumber: string, oldStatus: string, newStatus: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"SaaS ITS" <noreply@saas-its.com>',
        to: email,
        subject: `Ticket ${ticketNumber} - Status Updated`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Ticket Status Updated</h2>
            <p>Your ticket status has been updated:</p>
            <div style="background: #f4f4f4; padding: 15px;">
              <strong>Ticket:</strong> ${ticketNumber}<br>
              <strong>Previous Status:</strong> ${oldStatus}<br>
              <strong>New Status:</strong> <span style="color: #4CAF50;">${newStatus}</span>
            </div>
            <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 12px;">SaaS ITS - IT Service Management</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send status update email:', error);
    }
  }

  async sendTicketAssigned(operatorEmail: string, ticketNumber: string, title: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"SaaS ITS" <noreply@saas-its.com>',
        to: operatorEmail,
        subject: `New Ticket Assigned: ${ticketNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Ticket Assigned</h2>
            <p>A new ticket has been assigned to you:</p>
            <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #2196F3;">
              <strong>Ticket:</strong> ${ticketNumber}<br>
              <strong>Title:</strong> ${title}
            </div>
            <p>Please review and respond as soon as possible.</p>
            <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 12px;">SaaS ITS - IT Service Management</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send ticket assigned email:', error);
    }
  }

  async sendNewComment(email: string, ticketNumber: string, authorName: string, commentText: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"SaaS ITS" <noreply@saas-its.com>',
        to: email,
        subject: `New Comment on ${ticketNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Comment Added</h2>
            <p>A new comment has been added to your ticket:</p>
            <div style="background: #f4f4f4; padding: 15px;">
              <strong>Ticket:</strong> ${ticketNumber}<br>
              <strong>From:</strong> ${authorName}<br>
              <strong>Comment:</strong><br>
              <p style="margin-top: 10px;">${commentText}</p>
            </div>
            <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 12px;">SaaS ITS - IT Service Management</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send comment notification email:', error);
    }
  }
}

