import { useState } from 'react';
import type { FormEvent } from 'react';
import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';

const EMAIL = 'ahmad@keeways.com';

/**
 * POST target for the form. Leave empty and the form composes a pre-filled
 * mail draft instead, so it works with no backend at all. Drop in a Formspree
 * or Web3Forms URL here and it starts submitting for real -- no other changes.
 */
const FORM_ENDPOINT = '';

/** Only entries with a url are rendered, so there are never any dead links. */
const SOCIALS: Array<{ label: string; url: string }> = [
  { label: 'GitHub', url: '' },
  { label: 'LinkedIn', url: '' },
  { label: 'Dribbble', url: '' },
  { label: 'Instagram', url: '' },
];

const TICKER = [
  'available for freelance',
  '3d & motion',
  'web development',
  'brand identity',
  'taking projects for 2026',
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

const FIELD =
  'w-full rounded-2xl border border-[#D7E2EA]/12 bg-[#D7E2EA]/[0.03] px-5 py-4 text-[#D7E2EA] placeholder:text-[#D7E2EA]/25 outline-none transition-all duration-300 focus:border-[#B600A8]/70 focus:bg-[#D7E2EA]/[0.06] focus:shadow-[0_0_0_3px_rgba(182,1,167,0.16)]';

const LABEL =
  'block text-[0.6rem] font-light uppercase tracking-[0.25em] text-[#D7E2EA]/40 mb-2';

export default function ContactSection() {
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot -- bots fill every field they find, people never see this one.
    if (data.get('company')) {
      setStatus('sent');
      form.reset();
      return;
    }

    const name = String(data.get('name') ?? '');
    const email = String(data.get('email') ?? '');
    const subject = String(data.get('subject') ?? '');
    const message = String(data.get('message') ?? '');

    if (!FORM_ENDPOINT) {
      const body = `${message}\n\n— ${name} (${email})`;
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
        subject || `New enquiry from ${name}`,
      )}&body=${encodeURIComponent(body)}`;
      setStatus('sent');
      form.reset();
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure origin, denied permission) -- the address is
      // right there to select by hand, so there is nothing to recover from.
    }
  };

  const links = SOCIALS.filter((s) => s.url);
  const ticker = [...TICKER, ...TICKER, ...TICKER];

  return (
    <section
      id="contact"
      className="relative z-[5] w-full overflow-hidden pb-12 pt-20 sm:pt-24 md:pt-32"
      style={{ background: '#0C0C0C' }}
    >
      {/* Ambient bloom in the CTA's own colours -- the only warmth on the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[18%] h-[420px] w-[min(900px,110vw)] -translate-x-1/2 rounded-full opacity-60"
        style={{
          background:
            'radial-gradient(closest-side, rgba(182,1,167,0.22), rgba(118,33,176,0.12) 45%, transparent 75%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative px-5 sm:px-8 md:px-10">
        <FadeIn delay={0} y={20}>
          <div className="flex justify-center">
            <span className="flex items-center gap-2.5 rounded-full border border-[#D7E2EA]/15 bg-[#D7E2EA]/[0.03] px-4 py-2 text-[0.6rem] font-light uppercase tracking-[0.25em] text-[#D7E2EA]/60">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ECF8E] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#3ECF8E]" />
              </span>
              Open for work
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.08} y={40}>
          <h2
            className="hero-heading mt-7 text-center font-black uppercase leading-[0.85] tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Let&apos;s talk
          </h2>
        </FadeIn>

        {/* The address itself is the hero: outlined, filling with the brand
            gradient on hover. */}
        <FadeIn delay={0.18} y={30}>
          <div className="mt-10 flex flex-col items-center gap-5 sm:mt-12">
            <a
              href={`mailto:${EMAIL}`}
              className="contact-email font-black lowercase tracking-tight"
              style={{ fontSize: 'clamp(1.35rem, 5vw, 4.5rem)' }}
            >
              <span className="contact-email__outline">{EMAIL}</span>
              <span className="contact-email__fill" aria-hidden>
                {EMAIL}
              </span>
            </a>

            <button
              type="button"
              onClick={copyEmail}
              className="rounded-full border border-[#D7E2EA]/15 px-4 py-1.5 text-[0.6rem] font-light uppercase tracking-[0.25em] text-[#D7E2EA]/45 transition-colors duration-300 hover:border-[#D7E2EA]/50 hover:text-[#D7E2EA]"
            >
              {copied ? 'Copied ✓' : 'Copy address'}
            </button>
          </div>
        </FadeIn>
      </div>

      {/* Full-bleed ticker: the same marquee language as the Stack section. */}
      <div className="mt-14 border-y border-[#D7E2EA]/10 py-4 sm:mt-20">
        <div className="tech-marquee">
          <div
            className="tech-track"
            style={{ animationName: 'tech-scroll-left', animationDuration: '42s' }}
          >
            {ticker.map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex items-center whitespace-nowrap text-[0.7rem] font-light uppercase tracking-[0.3em] text-[#D7E2EA]/35 sm:text-sm"
                aria-hidden={i >= TICKER.length}
              >
                {item}
                <span className="mx-6 text-[#B600A8]/70 sm:mx-10" aria-hidden>
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative px-5 sm:px-8 md:px-10">
        <FadeIn delay={0.1} y={30}>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-14 max-w-3xl rounded-[28px] border border-[#D7E2EA]/12 p-6 sm:mt-20 sm:rounded-[36px] sm:p-10 md:p-12"
            style={{
              background:
                'linear-gradient(180deg, rgba(215,226,234,0.05), rgba(215,226,234,0.012))',
            }}
          >
            <p className="mb-8 text-center text-[0.65rem] font-light uppercase tracking-[0.25em] text-[#D7E2EA]/40">
              or leave the details here
            </p>

            <div className="flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className={LABEL} htmlFor="cf-name">
                    Your name
                  </label>
                  <input
                    id="cf-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    className={FIELD}
                  />
                </div>
                <div>
                  <label className={LABEL} htmlFor="cf-email">
                    Email
                  </label>
                  <input
                    id="cf-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={FIELD}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL} htmlFor="cf-subject">
                  What do you need
                </label>
                <input
                  id="cf-subject"
                  name="subject"
                  type="text"
                  placeholder="Brand identity, 3D product film, a website…"
                  className={FIELD}
                />
              </div>

              <div>
                <label className={LABEL} htmlFor="cf-message">
                  Message
                </label>
                <textarea
                  id="cf-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Scope, timeline, budget — whatever you have so far."
                  className={`${FIELD} resize-none`}
                />
              </div>
            </div>

            {/* Honeypot: off-screen, not hidden, so bots still find and fill it. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            <div className="mt-9 flex flex-col items-center gap-4">
              <Magnet padding={70} strength={5}>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="cta-gradient rounded-full px-12 py-4 text-xs font-medium uppercase tracking-widest text-white transition-transform duration-200 hover:scale-[1.04] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                >
                  {status === 'sending' ? 'Sending…' : 'Send it →'}
                </button>
              </Magnet>

              <p
                aria-live="polite"
                className="h-4 text-[0.65rem] font-light uppercase tracking-[0.2em]"
              >
                {status === 'sent' && (
                  <span className="text-[#3ECF8E]">
                    {FORM_ENDPOINT
                      ? 'Sent — talk soon'
                      : 'Draft opened in your mail app'}
                  </span>
                )}
                {status === 'error' && (
                  <span className="text-[#FF5A5F]">
                    Didn&apos;t go through — use the address above
                  </span>
                )}
              </p>
            </div>
          </form>
        </FadeIn>

        <div className="mx-auto mt-20 flex max-w-5xl flex-col items-center justify-between gap-5 border-t border-[#D7E2EA]/10 pt-8 sm:flex-row">
          <p className="text-[0.65rem] font-light uppercase tracking-[0.2em] text-[#D7E2EA]/35">
            © 2026 Ahmad Ghzayel
          </p>

          {links.length > 0 && (
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {links.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[0.65rem] font-light uppercase tracking-[0.2em] text-[#D7E2EA]/45 transition-colors duration-300 hover:text-[#D7E2EA]"
                  >
                    {social.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}

          <a
            href="#top"
            className="text-[0.65rem] font-light uppercase tracking-[0.2em] text-[#D7E2EA]/35 transition-colors duration-300 hover:text-[#D7E2EA]"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </section>
  );
}
