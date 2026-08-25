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
    body: JSON.stringify({
      _subject: `Engaz enquiry — ${data.name}`,
      _template: "table",
      Name: data.name,
      Email: data.email,
      Phone: data.phone || "—",
      "Project type": data.projectType || "—",
      Budget: data.budget || "—",
      Message: data.message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Relay rejected the submission: ${response.status}`);
  }
}
