import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Test connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error.message);
  } else {
    console.log('✓ Email service is ready');
  }
});

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const sendVerificationEmail = async (email, username, verificationToken) => {
  const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 32px; font-weight: bold; color: #667eea; }
        .content { text-align: center; color: #333; }
        .verification-btn { display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .verification-btn:hover { background-color: #5568d3; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
        .warning { background-color: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 5px; margin: 15px 0; font-size: 12px; color: #856404; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎭 MastiMeet</div>
        </div>
        
        <div class="content">
          <h2>Welcome to MastiMeet, ${username}!</h2>
          <p>Thank you for registering. To activate your account and start connecting with people, please verify your email address.</p>
          
          <a href="${verificationLink}" class="verification-btn">Verify Email Address</a>
          
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
            ${verificationLink}
          </p>
          
          <div class="warning">
            ⏱️ This verification link will expire in 24 hours.
          </div>
          
          <p style="margin-top: 20px; font-size: 14px;">
            If you didn't create this account, please ignore this email.
          </p>
        </div>
        
        <div class="footer">
          <p>© 2026 MastiMeet. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@mastimeet.com',
      to: email,
      subject: '🎭 MastiMeet - Verify Your Email Address',
      html: htmlContent
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

export const sendWelcomeEmail = async (email, username) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 32px; font-weight: bold; color: #667eea; }
        .content { color: #333; }
        .features { list-style: none; padding: 0; }
        .features li { padding: 10px 0; border-bottom: 1px solid #eee; }
        .features li:before { content: "✨ "; color: #667eea; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎭 MastiMeet</div>
        </div>
        
        <div class="content">
          <h2>Welcome to MastiMeet, ${username}! 🎉</h2>
          <p>Your email has been verified successfully! Your account is now fully active.</p>
          
          <h3>What you can do now:</h3>
          <ul class="features">
            <li>Start video chatting with people worldwide</li>
            <li>Text chat with new friends</li>
            <li>Find people based on shared interests</li>
            <li>Create your awesome profile</li>
            <li>Customize your preferences</li>
          </ul>
          
          <p>Start your journey: <a href="http://localhost:5173/video-chat" style="color: #667eea; text-decoration: none; font-weight: bold;">Begin Chatting Now →</a></p>
        </div>
        
        <div class="footer">
          <p>© 2026 MastiMeet. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@mastimeet.com',
      to: email,
      subject: '🎉 Welcome to MastiMeet! Your Email is Verified',
      html: htmlContent
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};
