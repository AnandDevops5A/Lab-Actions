/**
 * Utility module for sending tournament-related emails.
 * Provides a reusable function for sending approval emails with proper validation,
 * error handling, and configuration management.
 */

import nodemailer from 'nodemailer';

/**
 * Configuration for email transporter.
 * Centralized for easy modification and testing.
 */
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

/**
 * Email template for tournament approval.
 * @param {string} userName - The name of the user.
 * @param {string} tournamentName - The name of the tournament.
 * @returns {string} HTML content for the email.
 */
const createApprovalEmailTemplate = (userName, tournamentName) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">Congratulations ${userName}!</h2>
    <p>You have been <strong>approved</strong> to play in the tournament:</p>
    <p style="font-size: 18px; font-weight: bold; color: #007bff;">${tournamentName}</p>
    <p>We look forward to seeing you compete!</p>
    <br/>
    <p>Best regards,<br/>Tournament Committee</p>
  </div>
`;

/**
 * Validates input parameters for email sending.
 * @param {string} userEmail - The recipient's email address.
 * @param {string} userName - The name of the user.
 * @param {string} tournamentName - The name of the tournament.
 * @throws {Error} If any parameter is invalid.
 */
const validateEmailInputs = (userEmail, userName, tournamentName) => {
  if (!userEmail || typeof userEmail !== 'string' || !userEmail.includes('@')) {
    throw new Error('Invalid or missing user email');
  }
  if (!userName || typeof userName !== 'string' || userName.trim().length === 0) {
    throw new Error('Invalid or missing user name');
  }
  if (!tournamentName || typeof tournamentName !== 'string' || tournamentName.trim().length === 0) {
    throw new Error('Invalid or missing tournament name');
  }
};

/**
 * Sends a tournament approval email to the specified user.
 * @param {string} userEmail - The recipient's email address.
 * @param {string} userName - The name of the user.
 * @param {string} tournamentName - The name of the tournament.
 * @returns {Promise<boolean>} Resolves to true if email is sent successfully.
 * @throws {Error} If email sending fails or inputs are invalid.
 */
export const sendApprovalEmail = async (userEmail, userName, tournamentName) => {
  try {
    // Validate inputs
    validateEmailInputs(userEmail, userName, tournamentName);

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email configuration missing: EMAIL_USER or EMAIL_PASS not set');
    }

    // Create transporter
    const transporter = nodemailer.createTransporter(EMAIL_CONFIG);

    // Verify transporter configuration (optional, but good practice)
    await transporter.verify();

    // Prepare email options
    const mailOptions = {
      from: `"Tournament Admin" <${process.env.EMAIL_USER}>`,
      to: userEmail.trim(),
      subject: 'Tournament Approval 🎉',
      html: createApprovalEmailTemplate(userName.trim(), tournamentName.trim()),
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Approval email sent successfully to ${userEmail}: ${info.messageId}`);

    return true;
  } catch (error) {
    console.error('Failed to send approval email:', error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

/**
 * Next.js API handler for sending approval emails.
 * This can be used in pages/api/sendApprovalEmail.js
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userEmail, userName, tournamentName } = req.body;
    await sendApprovalEmail(userEmail, userName, tournamentName);
    return res.status(200).json({ message: 'Approval email sent successfully' });
  } catch (error) {
    console.error('API Error:', error.message);
    return res.status(400).json({ message: error.message });
  }
}
