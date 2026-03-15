import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: port ? Number(port) : 587,
      secure: port === "465",
      auth: { user, pass }
    });
  }
  return null;
}

/**
 * Send ride booked notification to emergency contact.
 * @param {Object} options
 * @param {string} options.toEmail - Emergency contact email
 * @param {string} options.riderName - Name of the person who booked
 * @param {string} options.pickup - Pickup location name
 * @param {string} options.dropoff - Dropoff location name
 * @param {string} options.fare - Fare amount
 * @param {string} options.driverName - Driver name
 * @param {string} options.otp - Ride OTP
 * @param {string} options.payment - Payment method
 */
export async function sendRideBookedToEmergencyContact({
  toEmail,
  riderName,
  pickup,
  dropoff,
  fare,
  driverName,
  otp,
  payment
}) {
  if (!toEmail || !toEmail.trim()) return { sent: false, reason: "No email" };

  const subject = `Rydo: ${riderName} has booked a ride`;
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #14324a;">Rydo Ride Notification</h2>
      <p>This is an automated notification because you are set as an emergency contact.</p>
      <p><strong>${riderName}</strong> has just booked a ride.</p>
      <ul style="line-height: 1.8;">
        <li><strong>Pickup:</strong> ${pickup}</li>
        <li><strong>Drop-off:</strong> ${dropoff}</li>
        <li><strong>Fare:</strong> Rs. ${fare}</li>
        <li><strong>Payment:</strong> ${payment}</li>
        <li><strong>Driver:</strong> ${driverName}</li>
        <li><strong>OTP:</strong> ${otp}</li>
      </ul>
      <p style="color: #6c6257; font-size: 0.9rem;">Ride booked at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}.</p>
      <p style="color: #6c6257; font-size: 0.85rem;">— Rydo</p>
    </div>
  `;

  const transporter = getTransporter();
  if (!transporter) {
    console.log("[Rydo] Emergency notification (no SMTP): would send to", toEmail, subject);
    return { sent: false, reason: "SMTP not configured" };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@rydo.com",
      to: toEmail.trim(),
      subject,
      html
    });
    return { sent: true };
  } catch (err) {
    console.error("[Rydo] Failed to send emergency notification:", err.message);
    return { sent: false, reason: err.message };
  }
}
