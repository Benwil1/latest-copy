const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

// SendGrid configuration
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Twilio configuration  
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const sendVerificationEmail = async (email, code, name, type = 'email_verification') => {
  try {
    let subject, html;

    if (type === 'email_verification') {
      subject = 'Verify your email - RoomieSwipe';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F97316;">Welcome to RoomieSwipe, ${name}!</h2>
          <p>Thank you for signing up. Please verify your email address by entering the following code:</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #F97316; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't create an account with RoomieSwipe, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This email was sent by RoomieSwipe. Please do not reply to this email.
          </p>
        </div>
      `;
    } else if (type === 'password_reset') {
      subject = 'Reset your password - RoomieSwipe';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F97316;">Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>You requested to reset your password. Please use the following code:</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #F97316; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
          </div>
          <p>This code will expire in 30 minutes.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This email was sent by RoomieSwipe. Please do not reply to this email.
          </p>
        </div>
      `;
    }

    const msg = {
      to: email,
      from: {
        email: process.env.VERIFIED_SENDER_EMAIL,
        name: 'RoomieSwipe'
      },
      subject,
      html,
    };

    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(msg);
    } else {
      console.log(`[DEV] Email verification code for ${email}: ${code}`);
    }
    
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
};

const sendVerificationSMS = async (phone, code) => {
  try {
    if (!twilioClient) {
      console.log(`SMS verification code for ${phone}: ${code}`);
      return; // Skip SMS in development if Twilio not configured
    }

    await twilioClient.messages.create({
      body: `Your RoomieSwipe verification code is: ${code}. This code will expire in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log(`Verification SMS sent to ${phone}`);
  } catch (error) {
    console.error('Failed to send verification SMS:', error);
    throw error;
  }
};

const sendNotificationEmail = async (email, subject, content, name) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F97316;">Hi ${name}!</h2>
        <div style="margin: 20px 0;">
          ${content}
        </div>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This email was sent by RoomieSwipe. You can manage your notification preferences in your account settings.
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"RoomieSwipe" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${subject} - RoomieSwipe`,
      html,
    };

    await emailTransporter.sendMail(mailOptions);
    console.log(`Notification email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send notification email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendVerificationSMS,
  sendNotificationEmail,
};