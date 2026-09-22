import { describe, expect, it } from "vitest";
import {
  buildContactPayload,
  isRelayFailure,
  isValidEmail,
} from "./contact";

const submission = {
  name: "Mona",
  email: "mona@example.com",
  phone: "",
  projectType: "Website",
  budget: "",
  message: "Need a site for my café.",
};

describe("isValidEmail", () => {
  it.each([
    "mona@example.com",
    "a.b+c@sub.domain.co",
    " spaced@ok.io ",
  ])("accepts %s", (value) => {
    expect(isValidEmail(value)).toBe(true);
  });

  it.each(["", "no-at-sign", "a@b", "a@b.c", "two @words.com", "@x.com"])(
    "rejects %s",
    (value) => {
      expect(isValidEmail(value)).toBe(false);
    },
  );
});

describe("buildContactPayload", () => {
  const payload = buildContactPayload(submission);

  it("sets the sender as the reply-to so mailbox replies reach them", () => {
    expect(payload._replyto).toBe("mona@example.com");
  });

  it("keeps the honeypot empty for FormSubmit's spam filter", () => {
    expect(payload._honey).toBe("");
  });

  it("fills optional fields with a dash rather than leaving blanks", () => {
    expect(payload.Phone).toBe("—");
    expect(payload.Budget).toBe("—");
  });

  it("carries the sender's details into the email table", () => {
    expect(payload.Name).toBe("Mona");
    expect(payload.Email).toBe("mona@example.com");
    expect(payload.Message).toBe(submission.message);
    expect(payload._template).toBe("table");
  });
});

describe("isRelayFailure", () => {
  it("treats HTTP errors as failures", () => {
    expect(isRelayFailure(500, null)).toBe(true);
    expect(isRelayFailure(200, null)).toBe(false);
  });

  it("treats a 200 with success:false as a failure — the relay refused silently", () => {
    expect(isRelayFailure(200, { success: "false", message: "not activated" })).toBe(true);
    expect(isRelayFailure(200, { success: "true" })).toBe(false);
  });
});
