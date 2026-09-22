/**
 * Contact form delivery.
 *
 * FormSubmit relays submissions to a mailbox without a backend or API key. The first
 * submission triggers a one-time confirmation email to the recipient; until that link
 * is clicked, nothing is delivered.
 *
 * The address is public in the client bundle, which is a spam-scraping risk. After
 * activating, FormSubmit issues a hashed endpoint id — set NEXT_PUBLIC_CONTACT_FORM_ID
 * to that hash and the address stops appearing in the bundle.
 */
const FORM_ID = process.env.NEXT_PUBLIC_CONTACT_FORM_ID || "hassanmamdouh461@gmail.com";

export const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${FORM_ID}`;

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/**
 * Field names become rows in the relayed email's table; underscore-prefixed keys are
 * FormSubmit controls and are not rendered. `_replyto` makes the mailbox's Reply
 * button answer the sender — without it replies go nowhere. `_honey` is the honeypot:
 * it must stay empty; spam bots that fill it are dropped server-side.
 */
export function buildContactPayload(data: ContactSubmission): Record<string, string> {
  return {
    _subject: `Engaz enquiry — ${data.name}`,
    _template: "table",
    _replyto: data.email,
    _honey: "",
    Name: data.name,
    Email: data.email,
    Phone: data.phone || "—",
    "Project type": data.projectType || "—",
    Budget: data.budget || "—",
    Message: data.message,
  };
}

/**
 * The AJAX endpoint answers 200 even when it refuses the submission — the JSON body
 * carries `success: "false"` (unactivated form, rejected payload). Checking the body
 * is the difference between a delivered message and a silent loss.
 */
export function isRelayFailure(status: number, body: unknown): boolean {
  if (status < 200 || status >= 300) return true;
  if (typeof body !== "object" || body === null) return false;
  return (body as { success?: unknown }).success === "false";
}

/**
 * Sends the submission and resolves only when the relay accepts it, so the caller can
 * distinguish a real delivery from a network or configuration failure.
 */
export async function sendContactMessage(data: ContactSubmission): Promise<void> {
  const response = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(buildContactPayload(data)),
  });

  const body: unknown = await response.json().catch(() => null);

  if (isRelayFailure(response.status, body)) {
    throw new Error(`Relay rejected the submission: ${response.status}`);
  }
}
