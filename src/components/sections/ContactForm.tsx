"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tape } from "@/components/ui/Tape";
import { content } from "@/lib/content";
import { sendContactMessage } from "@/lib/contact";
import { resolveIcon } from "@/lib/icons";
import { lift, slideInX, staggerContainer, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";

const { contact } = content;
const { form } = contact;

const NOTE_TONE = [
  "bg-brand-cyan",
  "bg-brand-yellow",
  "bg-brand-pink",
  "bg-brand-mint",
] as const;

/** Resting tilts, so a column of notes never looks machine-aligned. */
const NOTE_TILT = [-2, 1, -1, 2] as const;

type Status =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  | "errorEmail"
  | "errorSend"
  | "errorCooldown";

/** Minimum gap between submissions, to stop accidental double-sends and rapid spam. */
const COOLDOWN_SECONDS = 30;

export function ContactForm() {
  const { t } = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sector, setSector] = useState("");
  const [scope, setScope] = useState("");
  const [message, setMessage] = useState("");
  const [cooldownLeft, setCooldownLeft] = useState(0);
  // Kept in a ref so the countdown effect does not need to re-run on every tick.
  const sentAtRef = useRef(0);

  useEffect(() => {
    if (cooldownLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      const elapsed = (Date.now() - sentAtRef.current) / 1000;
      setCooldownLeft(Math.max(0, Math.ceil(COOLDOWN_SECONDS - elapsed)));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownLeft]);

  // Info enters from the left, form from the right. Layout is always left-to-right.
  const slideFromStart = useMemo(() => slideInX(-60), []);
  const slideFromEnd = useMemo(() => slideInX(60), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const elapsed = (Date.now() - sentAtRef.current) / 1000;
    if (sentAtRef.current > 0 && elapsed < COOLDOWN_SECONDS) {
      setCooldownLeft(Math.ceil(COOLDOWN_SECONDS - elapsed));
      setStatus("errorCooldown");
      return;
    }

    if (!organization.trim() || !message.trim()) {
      setStatus("error");
      return;
    }

    // A reply is impossible without a reachable address, so this one is required.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setStatus("errorEmail");
      return;
    }

    setStatus("submitting");

    try {
      await sendContactMessage({
        name: organization.trim(),
        email: email.trim(),
        phone: phone.trim(),
        projectType: sector,
        budget: scope.trim(),
        message: message.trim(),
      });
    } catch {
      setStatus("errorSend");
      return;
    }

    sentAtRef.current = Date.now();
    setCooldownLeft(COOLDOWN_SECONDS);
    setStatus("success");
    setOrganization("");
    setEmail("");
    setPhone("");
    setSector("");
    setScope("");
    setMessage("");
  }

  const locked = status === "submitting" || cooldownLeft > 0;

  return (
    <Section id="contact">
      <SectionHeading
        eyebrow={t(contact.eyebrow)}
        heading={t(contact.heading)}
        body={t(contact.body)}
        accent="pink"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-10 grid gap-6 sm:mt-14 sm:gap-8 lg:grid-cols-[0.8fr_1.2fr]"
      >
        {/* Channels are sticky notes: each tilted at rest, straightening and lifting
            out from under its tape on hover. */}
        <motion.ul variants={slideFromStart} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          {contact.channels.map((channel, index) => {
            const Icon = resolveIcon(channel.icon);
            const tone = NOTE_TONE[index % NOTE_TONE.length];
            const tilt = NOTE_TILT[index % NOTE_TILT.length];

            return (
              <li key={channel.id} className="relative">
                <Tape
                  className="-top-3 end-2 z-10 h-7 w-[70px]"
                  style={{ transform: `rotate(${15 + tilt}deg)` }}
                />
                <motion.a
                  href={channel.href ?? undefined}
                  dir={channel.href ? "ltr" : undefined}
                  initial={{ rotate: tilt }}
                  whileHover={lift}
                  whileFocus={lift}
                  className={`flex min-h-[7rem] flex-col items-center justify-center gap-1 border-3 border-edge px-4 py-5 text-center text-black shadow-neo-6 ${tone}`}
                >
                  <Icon aria-hidden className="h-7 w-7" />
                  <span className="font-hand text-lg font-bold">{t(channel.label)}</span>
                  <span dir="ltr" className="max-w-full truncate font-mono text-sm font-semibold">
                    {channel.value}
                  </span>
                </motion.a>
              </li>
            );
          })}
        </motion.ul>

        <motion.form
          variants={slideFromEnd}
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5 border-4 border-edge bg-surface p-5 shadow-neo-8 sm:p-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="organization" className="neo-label">
                {t(form.organization)}
              </label>
              <input
                id="organization"
                name="organization"
                value={organization}
                onChange={(event) => setOrganization(event.target.value)}
                required
                className="neo-input"
              />
            </div>
            <div>
              <label htmlFor="email" className="neo-label">
                {t(form.email)}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t(form.emailPlaceholder)}
                required
                className="neo-input"
              />
            </div>

            <div>
              <label htmlFor="phone" className="neo-label">
                {t(form.phone)}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={t(form.phonePlaceholder)}
                className="neo-input"
              />
            </div>

            <div>
              <label htmlFor="sector" className="neo-label">
                {t(form.sector)}
              </label>
              <select
                id="sector"
                name="sector"
                value={sector}
                onChange={(event) => setSector(event.target.value)}
                className="neo-input"
              >
                <option value="">{t(form.sectorPlaceholder)}</option>
                {form.sectorOptions.map((option) => (
                  <option key={option.en} value={option.en}>
                    {t(option)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="scope" className="neo-label">
              {t(form.scope)}
            </label>
            <input
              id="scope"
              name="scope"
              value={scope}
              onChange={(event) => setScope(event.target.value)}
              placeholder={t(form.scopePlaceholder)}
              className="neo-input"
            />
          </div>

          <div>
            <label htmlFor="message" className="neo-label">
              {t(form.message)}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={t(form.messagePlaceholder)}
              required
              className="neo-input resize-y"
            />
          </div>

          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="submit"
              disabled={locked}
              className="neo-btn-yellow w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {status === "submitting" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {status === "submitting"
                ? t(form.submitting)
                : cooldownLeft > 0
                  ? `${t(form.submit)} (${cooldownLeft}s)`
                  : t(form.submit)}
            </button>

            <p
              role="status"
              aria-live="polite"
              className="text-sm font-semibold text-ink empty:hidden"
            >
              {status === "success" ? (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 border-3 border-edge bg-brand-mint px-3 py-1 text-black"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {t(form.success)}
                </motion.span>
              ) : null}
              {status === "errorCooldown" ? (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-block border-3 border-edge bg-brand-yellow px-3 py-1 text-black"
                >
                  {t(form.errorCooldown).replace("{seconds}", String(cooldownLeft))}
                </motion.span>
              ) : null}
              {status === "error" || status === "errorEmail" || status === "errorSend" ? (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-block border-3 border-edge bg-brand-pink px-3 py-1 text-black"
                >
                  {status === "errorEmail"
                    ? t(form.errorEmail)
                    : status === "errorSend"
                      ? t(form.errorSend)
                      : t(form.error)}
                </motion.span>
              ) : null}
            </p>
          </div>
        </motion.form>
      </motion.div>
    </Section>
  );
}
