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

async function getSmsClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromPhone) return null;
  try {
    const twilio = (await import("twilio")).default;
    return {
      client: twilio(accountSid, authToken),
      fromPhone
    };
  } catch {
    console.log("[Rydo] Twilio not installed; SMS notifications disabled. Install with: npm install twilio");
    return null;
  }
}

export async function sendRideBookedToEmergencyContact({
  toEmail,
  contactPhone,
  riderName,
  pickup,
  dropoff,
  fare,
  driverName,
  vehicleNumber,
  otp,
  payment
}) {
  const hasEmail = Boolean(toEmail && toEmail.trim());
  const hasPhone = Boolean(contactPhone && contactPhone.trim());

  if (!hasEmail && !hasPhone) {
    return { emailSent: false, smsSent: false, reason: "No emergency contact destination configured" };
  }

  const subject = `Rydo: ${riderName} has booked a ride`;
  const textBody = [
    `Rydo safety alert for ${riderName}.`,
    `Pickup: ${pickup}.`,
    `Drop-off: ${dropoff}.`,
    `Driver: ${driverName}.`,
    `Vehicle number: ${vehicleNumber}.`,
    `Fare: Rs. ${fare}.`,
    `Payment: ${payment}.`,
    `OTP: ${otp}.`
  ].join(" ");

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
        <li><strong>Vehicle number:</strong> ${vehicleNumber}</li>
        <li><strong>OTP:</strong> ${otp}</li>
      </ul>
      <p style="color: #6c6257; font-size: 0.9rem;">Ride booked at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}.</p>
      <p style="color: #6c6257; font-size: 0.85rem;">- Rydo</p>
    </div>
  `;

  let emailSent = false;
  let smsSent = false;

  if (hasEmail) {
    const transporter = getTransporter();
    if (!transporter) {
      console.log("[Rydo] Emergency email notification (no SMTP): would send to", toEmail, subject);
    } else {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@rydo.com",
          to: toEmail.trim(),
          subject,
          html
        });
        emailSent = true;
      } catch (err) {
        console.error("[Rydo] Failed to send emergency email notification:", err.message);
      }
    }
  }

  if (hasPhone) {
    const smsService = await getSmsClient();
    if (!smsService) {
      console.log("[Rydo] Emergency SMS notification (no SMS provider): would send to", contactPhone, textBody);
    } else {
      try {
        await smsService.client.messages.create({
          body: textBody,
          from: smsService.fromPhone,
          to: contactPhone.trim()
        });
        smsSent = true;
      } catch (err) {
        console.error("[Rydo] Failed to send emergency SMS notification:", err.message);
      }
    }
  }

  return { emailSent, smsSent };
}
