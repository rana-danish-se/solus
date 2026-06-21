import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;

let transporter;

function getTransporter() {
  if (!transporter) {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.warn('[Notification] Gmail credentials not configured. Email notifications disabled.');
      return null;
    }
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function sendEmail(to, subject, body) {
  const tx = getTransporter();
  if (!tx) {
    console.log('[Notification] Skipping email (not configured)');
    return;
  }

  const mailOptions = {
    from: `"Solus OS" <${GMAIL_USER}>`,
    to: to || NOTIFY_EMAIL,
    subject,
    html: body,
  };

  try {
    const result = await tx.sendMail(mailOptions);
    console.log(`[Notification] Email sent to ${mailOptions.to}: ${subject}`);
    return result;
  } catch (err) {
    console.error('[Notification] Failed to send email:', err.message);
    throw err;
  }
}