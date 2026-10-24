import nodemailer, { type Transporter } from "nodemailer";

/**
 * Admin email notifications via Gmail SMTP + Nodemailer (same method as the
 * AP website). Server-side only — SMTP credentials must never reach the
 * browser.
 *
 * Env: SMTP_USER (Gmail address), SMTP_PASS (Gmail App Password, not the
 * account password), NOTIFY_ADMIN_EMAIL (recipient; comma-separated for
 * several).
 *
 * Called exactly once per successful Supabase save; email failure is logged
 * but never fails the user's submission (the record is already saved).
 */

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  whatsapp: "WhatsApp",
  interest: "Interested in",
  program: "Program",
  mode: "Batch",
  schedule: "Schedule",
  start_date: "Start date",
  fee: "Fee",
  location: "Location",
  city: "City",
  status: "Current status",
  situation: "Situation",
  question: "Question",
  preferred_day: "Preferred day",
  time_slot: "Time slot",
  audience: "I am a",
  chapter: "Chapter",
  role: "Role",
  message: "Message",
  notes: "Notes",
  subject: "Subject",
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

let transporter: Transporter | null = null;
function getTransporter() {
  if (transporter) return transporter;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
  return transporter;
}

export async function sendAdminNotification(
  type: string,
  data: Record<string, string>,
  reference?: string,
): Promise<void> {
  const to = process.env.NOTIFY_ADMIN_EMAIL;
  const t = getTransporter();
  if (!t || !to) {
    console.warn(
      "[notify] SMTP_USER / SMTP_PASS / NOTIFY_ADMIN_EMAIL not set — admin email skipped.",
    );
    return;
  }

  const entries = Object.entries(data).filter(([k, v]) => v && k !== "source_page");
  const rows = entries
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#555;white-space:nowrap">${escapeHtml(
          FIELD_LABELS[k] ?? k,
        )}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:system-ui,sans-serif;font-size:14px;color:#111">
      <h2 style="margin:0 0 4px">New ${escapeHtml(type)} submission</h2>
      ${reference ? `<p style="margin:0 0 12px;color:#555">Reference: <strong>${escapeHtml(reference)}</strong></p>` : ""}
      <table style="border-collapse:collapse">${rows}</table>
      ${data.source_page ? `<p style="margin-top:12px;color:#888;font-size:12px">Source: ${escapeHtml(data.source_page)}</p>` : ""}
      <p style="margin-top:12px;color:#888;font-size:12px">Saved to Supabase at ${new Date().toISOString()}</p>
    </div>`;
  const text =
    `New ${type} submission\n` +
    (reference ? `Reference: ${reference}\n` : "") +
    entries.map(([k, v]) => `${FIELD_LABELS[k] ?? k}: ${v}`).join("\n");

  try {
    await t.sendMail({
      from: `"Fundamental Website" <${process.env.SMTP_USER}>`,
      to,
      subject: `New ${type} submission${data.name ? ` — ${data.name}` : ""}${reference ? ` (${reference})` : ""}`,
      text,
      html,
    });
  } catch (err) {
    console.error(
      "[notify] email send failed:",
      err instanceof Error ? err.message : err,
    );
  }
}
