// server/utils/reminders.js

// ─── 1) Load .env immediately ─────────────────────────
import dotenv from "dotenv";
dotenv.config();

// ─── 2) External imports ───────────────────────────────
import nodemailer from "nodemailer";
import Twilio     from "twilio";

// ─── 3) Debug env vars ─────────────────────────────────
console.log("⚙️  Loading reminders.js with env:");
console.log("   SMTP_HOST   =", process.env.SMTP_HOST);
console.log("   SMTP_PORT   =", process.env.SMTP_PORT);
console.log("   SMTP_SECURE =", process.env.SMTP_SECURE);
console.log("   SMTP_USER   =", process.env.SMTP_USER ? "[OK]" : "[MISSING]");
console.log("   SMTP_PASS   =", process.env.SMTP_PASS ? "[OK]" : "[MISSING]");
console.log("   SMTP_FROM   =", process.env.SMTP_FROM);
console.log("   TWILIO_SID    =", process.env.TWILIO_SID ? "[OK]" : "[MISSING]");
console.log("   TWILIO_TOKEN  =", process.env.TWILIO_TOKEN ? "[OK]" : "[MISSING]");
console.log("   TWILIO_FROM   =", process.env.TWILIO_FROM);
console.log("   TWILIO_WHATSAPP_FROM =", process.env.TWILIO_WHATSAPP_FROM);

// ─── Helper: Normalize phone to E.164 ─────────────────
function normalizePhone(phone) {
  // strip all non‑digits, then prepend a single +
  const digits = phone.replace(/\D/g, "");
  return `+${digits}`;
}

// ─── 4) EMAIL SETUP (Nodemailer) ───────────────────────
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  console.warn("⚠️  Skipping email setup—missing SMTP config");
}

// 📧 Send email reminder
export async function sendEmail(task) {
  if (!transporter) {
    console.warn("⚠️  Cannot send email; transporter not configured");
    return;
  }
  try {
    await transporter.sendMail({
      from: `"SmartTasker" <${process.env.SMTP_FROM}>`,
      to: task.user,
      subject: `Reminder: ${task.title}`,
      text: task.description || "You asked me to remind you about this task.",
    });
    console.log(`📧 Email sent for task ${task._id}`);
  } catch (err) {
    console.error("❌ Email send error:", err);
  }
}

// ─── 5) SMS + WhatsApp SETUP (Twilio) ──────────────────
let twilioClient = null;
if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
  twilioClient = new Twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
  );
} else {
  console.warn("⚠️  Skipping SMS/WhatsApp setup—missing Twilio credentials");
}

// 📱 Send SMS reminder
export async function sendSMS(task) {
  console.log("ℹ️  sendSMS called for task", task._id);
  console.log("    Raw phone   =", task.phone);

  const toNumber = normalizePhone(task.phone);
  console.log("    Normalized  =", toNumber);

  if (!twilioClient) {
    console.warn("⚠️  Cannot send SMS; Twilio client not configured");
    return;
  }
  if (!process.env.TWILIO_FROM) {
    console.warn("⚠️  Cannot send SMS; TWILIO_FROM not set");
    return;
  }
  if (!task.phone || task.phone.trim() === "") {
    console.warn(`⚠️  Cannot send SMS for task ${task._id}; no phone number`);
    return;
  }

  try {
    const msg = await twilioClient.messages.create({
      from: process.env.TWILIO_FROM,
      to: toNumber,
      body: `🔔 Reminder: ${task.title}\n${task.description || ""}`,
    });
    console.log("📱 SMS sent, SID:", msg.sid);
  } catch (err) {
    console.error("❌ SMS send error:", err);
  }
}

// 📲 Send WhatsApp reminder
export async function sendWhatsApp(task) {
  console.log("ℹ️  sendWhatsApp called for task", task._id);
  console.log("    Raw phone          =", task.phone);

  const toNumber = normalizePhone(task.phone);
  console.log("    Normalized WhatsApp=", toNumber);

  if (!twilioClient) {
    console.warn("⚠️  Cannot send WhatsApp; Twilio not configured");
    return;
  }
  if (!process.env.TWILIO_WHATSAPP_FROM) {
    console.warn("⚠️  TWILIO_WHATSAPP_FROM not set in .env");
    return;
  }
  if (!task.phone || task.phone.trim() === "") {
    console.warn(`⚠️  Cannot send WhatsApp for task ${task._id}; no phone number`);
    return;
  }

  try {
    const msg = await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to:   `whatsapp:${toNumber}`,
      body: `Reminder: ${task.title}\n${task.description || ""}`,
    });
    console.log("WhatsApp sent, SID:", msg.sid);
  } catch (err) {
    console.error(" WhatsApp send error:", err);
  }
}
