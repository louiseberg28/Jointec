function formatLeadLines(lead) {
  return [
    `Name: ${lead.name}`,
    `Company: ${lead.company}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || ""}`,
    `Country: ${lead.country}`,
    `Solution interest: ${lead.machineInterest}`,
    `Source page: ${lead.sourcePage}`,
    `Message: ${lead.message || ""}`,
    `Consent: ${lead.consent ? "Yes" : "No"}`,
    `Created: ${lead.createdAt}`,
  ].join("\n");
}

async function sendResendEmail(env, payload) {
  if (!env.RESEND_API_KEY) return { skipped: true, reason: "RESEND_API_KEY is not configured." };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend email failed with ${response.status}: ${text}`);
  }

  return response.json();
}

export async function sendLeadEmails(env, lead) {
  const from = env.RESEND_FROM_EMAIL || "Jointec <onboarding@resend.dev>";
  const notifyTo = env.LEAD_NOTIFY_EMAIL || "info@jointec.se";
  const replyTo = lead.email;

  const adminEmail = sendResendEmail(env, {
    from,
    to: [notifyTo],
    reply_to: replyTo,
    subject: `New Jointec website lead - ${lead.company}`,
    text: [
      "A new lead was submitted through jointec.se.",
      "",
      formatLeadLines(lead),
    ].join("\n"),
  });

  const thankYouEmail = sendResendEmail(env, {
    from,
    to: [lead.email],
    reply_to: notifyTo,
    subject: "Thank you for contacting Jointec",
    text: [
      `Hello ${lead.name},`,
      "",
      "Thank you for your interest in Jointec.",
      "",
      "We have received your request and will review it shortly. A Jointec representative will contact you if your message requires a direct follow-up.",
      "",
      "Summary of your request:",
      formatLeadLines(lead),
      "",
      "Best regards,",
      "Jointec",
    ].join("\n"),
  });

  return Promise.allSettled([adminEmail, thankYouEmail]);
}

