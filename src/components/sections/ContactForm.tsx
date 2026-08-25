"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";
import { sendContactMessage } from "@/lib/contact";
import { resolveIcon } from "@/lib/icons";
import { slideInX, staggerContainer, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";

const { contact } = content;
const { form } = contact;

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
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-[0.85fr_1.15fr]"
      >
        <motion.ul
          variants={slideFromStart}
          className="grid gap-4 sm:grid-cols-2 md:col-span-2 md:grid-cols-4 lg:col-span-1 lg:grid-cols-1"
        >
          {contact.channels.map((channel) => {
            const Icon = resolveIcon(channel.icon);
            return (
              <motion.li
                key={channel.id}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="glass-card p-4 sm:p-5"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-base-900/70 text-cyan-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      {t(channel.label)}
                    </p>
                    {channel.href ? (
                      // -my-2 py-2 keeps the visual position while giving a ~40px tap row.
                      <a
                        href={channel.href}
                        dir="ltr"
                        className="mt-1 block truncate py-2 text-sm font-medium text-slate-200 transition-colors hover:text-cyan-300"
                      >
                        {channel.value}
                      </a>
                    ) : (
                      <p dir="ltr" className="mt-1 truncate text-sm font-medium text-slate-200">
                        {channel.value}
                      </p>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>

        <motion.form
          variants={slideFromEnd}
          onSubmit={handleSubmit}
          noValidate
          className="glass-surface flex flex-col gap-5 p-5 sm:p-7 md:col-span-2 lg:col-span-1"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="organization" className="field-label">
                {t(form.organization)}
              </label>
              <input
                id="organization"
                name="organization"
                value={organization}
                onChange={(event) => setOrganization(event.target.value)}
                required
                className="field-input"
              />
            </div>
            <div>
              <label htmlFor="email" className="field-label">
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
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor="phone" className="field-label">
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
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor="sector" className="field-label">
                {t(form.sector)}
              </label>
              <select
                id="sector"
                name="sector"
                value={sector}
                onChange={(event) => setSector(event.target.value)}
                className="field-input"
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
            <label htmlFor="scope" className="field-label">
              {t(form.scope)}
            </label>
            <input
              id="scope"
              name="scope"
              value={scope}
              onChange={(event) => setScope(event.target.value)}
              placeholder={t(form.scopePlaceholder)}
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="message" className="field-label">
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
              className="field-input resize-y"
            />
          </div>

          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <motion.button
              type="submit"
              disabled={locked}
              whileHover={locked ? undefined : { scale: 1.04 }}
              whileTap={locked ? undefined : { scale: 0.97 }}
              className="btn-primary w-full sm:w-auto"
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
            </motion.button>

            <p
              role="status"
              aria-live="polite"
              className="text-sm text-slate-400 empty:hidden"
            >
              {status === "success" ? (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 text-emerald-300"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {t(form.success)}
                </motion.span>
              ) : null}
              {status === "errorCooldown" ? (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-amber-300"
                >
                  {t(form.errorCooldown).replace("{seconds}", String(cooldownLeft))}
                </motion.span>
              ) : null}
              {status === "error" || status === "errorEmail" || status === "errorSend" ? (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-rose-300"
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
