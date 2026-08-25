"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";
import { resolveIcon } from "@/lib/icons";
import { slideInX, staggerContainer, viewportOnce } from "@/lib/motion";
import { useLocale } from "@/lib/locale-context";

const { contact } = content;
const { form } = contact;

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const { t, isRtl } = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [organization, setOrganization] = useState("");
  const [sector, setSector] = useState("");
  const [scope, setScope] = useState("");
  const [message, setMessage] = useState("");

  // Info enters from the outer edge, form from the inner edge; both mirror under RTL.
  const sign = isRtl ? -1 : 1;
  const slideFromStart = useMemo(() => slideInX(-60, sign), [sign]);
  const slideFromEnd = useMemo(() => slideInX(60, sign), [sign]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!organization.trim() || !message.trim()) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    // Replace this delay with a POST to your own intake endpoint.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("success");
    setOrganization("");
    setSector("");
    setScope("");
    setMessage("");
  }

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
        className="mt-14 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"
      >
        <motion.ul variants={slideFromStart} className="flex flex-col gap-4">
          {contact.channels.map((channel) => {
            const Icon = resolveIcon(channel.icon);
            return (
              <motion.li
                key={channel.id}
                whileHover={{ x: 6 * sign }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="glass-card p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-base-900/70 text-cyan-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      {t(channel.label)}
                    </p>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        dir="ltr"
                        className="mt-1 block truncate text-sm font-medium text-slate-200 transition-colors hover:text-cyan-300"
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
          className="glass-surface flex flex-col gap-5 p-7"
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

          <div className="flex flex-wrap items-center gap-4">
            <motion.button
              type="submit"
              disabled={status === "submitting"}
              whileHover={status === "submitting" ? undefined : { scale: 1.04 }}
              whileTap={status === "submitting" ? undefined : { scale: 0.97 }}
              className="btn-primary"
            >
              {status === "submitting" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {status === "submitting" ? t(form.submitting) : t(form.submit)}
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
              {status === "error" ? (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-rose-300"
                >
                  {t(form.error)}
                </motion.span>
              ) : null}
            </p>
          </div>
        </motion.form>
      </motion.div>
    </Section>
  );
}
