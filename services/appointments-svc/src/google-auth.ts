/**
 * google-auth.ts
 * Handles Google OAuth flow for technician calendar access
 */
import { Router } from 'express';
import { google } from 'googleapis';
import { prisma } from './db.js';
import { logger } from './logger.js';

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

// Initialize OAuth2 client
export function getOAuth2Client() {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
}

/**
 * Step 1: Redirect to Google OAuth consent screen
 * Query param: technicianId - ID of technician to authorize
 */
router.get('/start', (req, res) => {
  const technicianId = req.query.technicianId as string;
  
  if (!technicianId) {
    return res.status(400).json({ error: 'technicianId query parameter required' });
  }
  
  const oauth2Client = getOAuth2Client();
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
    ],
    prompt: 'consent', // Force to get refresh token
    state: technicianId, // Pass technicianId through OAuth flow
  });
  
  logger.info({ technicianId }, 'Redirecting to Google OAuth');
  res.redirect(authUrl);
});

/**
 * Step 2: Handle OAuth callback from Google
 * Exchanges authorization code for tokens and stores refresh_token
 */
router.get('/callback', async (req, res) => {
  const code = req.query.code as string;
  const technicianId = req.query.state as string;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code missing' });
  }
  
  if (!technicianId) {
    return res.status(400).json({ error: 'Technician ID missing from state' });
  }
  
  try {
    const oauth2Client = getOAuth2Client();
    
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.refresh_token) {
      throw new Error('No refresh token received. User may have already authorized.');
    }
    
    // Update technician with refresh token
    await prisma.technician.update({
      where: { id: technicianId },
      data: { googleRefreshToken: tokens.refresh_token },
    });
    
    logger.info({ technicianId }, 'Google Calendar connected successfully');
    
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Calendar Connected</title>
          <style>
            body { font-family: system-ui; max-width: 600px; margin: 100px auto; text-align: center; }
            .success { color: #22c55e; font-size: 48px; margin-bottom: 20px; }
            h1 { color: #1f2937; }
            p { color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="success">✓</div>
          <h1>Calendar Connected Successfully!</h1>
          <p>Technician ID: <strong>${technicianId}</strong></p>
          <p>You can close this window now.</p>
        </body>
      </html>
    `);
  } catch (error: any) {
    logger.error({ error, technicianId }, 'OAuth callback error');
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Connection Failed</title>
          <style>
            body { font-family: system-ui; max-width: 600px; margin: 100px auto; text-align: center; }
            .error { color: #ef4444; font-size: 48px; margin-bottom: 20px; }
            h1 { color: #1f2937; }
            p { color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="error">✗</div>
          <h1>Connection Failed</h1>
          <p>${error.message || 'Unknown error occurred'}</p>
        </body>
      </html>
    `);
  }
});

export const googleAuthRoutes = router;

