'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Smartphone, Laptop } from 'lucide-react';
import { YOUTUBE_CHANNEL_URL } from '@/data/youtubeCompanions';
import { sampleWords } from '@/data/words';

const PHRASE_COUNT = sampleWords.length;

const SOCIAL_LINKS = [
  { id: 'youtube', label: 'YouTube', href: YOUTUBE_CHANNEL_URL, icon: YoutubeIcon },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/jsi_toriyama?igsh=amZjM2p6d3QxdzVv',
    icon: InstagramIcon,
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/miyazaki_jsi?s=21&t=qlLFdzbNuQFerhEmqFfzWQ',
    icon: XSocialIcon,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@japanesesuperimmersion?_r=1&_t=ZS-97O0Er7WjOp',
    icon: TikTokIcon,
  },
] as const;

const FEATURES = [
  {
    id: 'friction',
    eyebrow: 'Zero Friction',
    title: 'Open. Learn. Done.',
    subtitle:
      'No account. No setup. Open your browser at the hotel or airport and start practicing travel phrases immediately.',
    accent: 'from-[#ff6b35]/10 via-transparent to-transparent',
  },
  {
    id: 'context',
    eyebrow: 'Context is Everything',
    title: 'Phrases for real situations.',
    subtitle:
      'Convenience stores, trains, restaurants, hotels — every phrase ties back to the moments you will actually face in Japan.',
    accent: 'from-[#6366f1]/10 via-transparent to-transparent',
  },
  {
    id: 'anywhere',
    eyebrow: 'Study Anywhere',
    title: 'Your device. Your pace.',
    subtitle:
      'On the shinkansen, in the hotel lobby, or at the konbini queue — one tap and you are back in flow.',
    accent: 'from-[#0ea5e9]/10 via-transparent to-transparent',
  },
] as const;

const APP_PATH = '/';

export default function LandingPage() {
  const router = useRouter();
  const [navScrolled, setNavScrolled] = useState(false);

  const goToApp = useCallback(
    (word?: string) => {
      const q = word?.trim();
      router.push(q ? `${APP_PATH}?q=${encodeURIComponent(q)}` : APP_PATH);
    },
    [router],
  );

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black font-[family-name:var(--font-geist-sans)] text-[#f5f5f7] antialiased selection:bg-[#2997ff]/25 selection:text-[#2997ff]">
      {/* ── Nav ── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          navScrolled
            ? 'border-b border-white/[0.08] bg-black/75 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl backdrop-saturate-150'
            : 'bg-black/40 backdrop-blur-xl'
        }`}
      >
        <nav className="relative mx-auto flex h-11 max-w-[980px] items-center justify-between px-6 sm:h-12">
          <Link
            href="/lp"
            className="text-[12px] font-medium tracking-[-0.01em] text-[#f5f5f7]/90 transition-opacity duration-500 hover:opacity-55"
          >
            Japanese Super Words
          </Link>

          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-4">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-[#f5f5f7]/40 transition-all duration-500 hover:text-[#f5f5f7]"
              >
                <link.icon className="h-[14px] w-[14px]" />
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goToApp()}
            className="rounded-full bg-[#2997ff] px-3.5 py-1 text-[12px] font-normal text-white transition-all duration-500 hover:bg-[#40a9ff]"
          >
            Try Free
          </button>
        </nav>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-[52px]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(ellipse_70%_55%_at_50%_-5%,rgba(99,102,241,0.18),transparent_65%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-32 h-[400px] bg-[radial-gradient(ellipse_50%_40%_at_80%_20%,rgba(255,107,53,0.1),transparent_60%)]"
          />

          <div className="relative mx-auto max-w-[980px] px-6 pt-16 text-center sm:pt-20 md:pt-24">
            <Reveal>
              <p className="text-[14px] font-medium tracking-[0.02em] text-[#a1a1a6]">
                No login required · Built for Japan travel
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mx-auto mt-3 max-w-[14ch] text-[40px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#f5f5f7] sm:max-w-none sm:text-[56px] md:text-[64px] md:leading-[1.02] lg:text-[72px]">
                Real Japanese for
                <br />
                <span className="bg-gradient-to-r from-[#818cf8] via-[#a78bfa] to-[#fb923c] bg-clip-text text-transparent">
                  your next trip.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mx-auto mt-5 max-w-[32rem] text-[17px] leading-[1.47] tracking-[-0.01em] text-[#a1a1a6] sm:mt-6 sm:text-[19px] sm:leading-[1.42] md:max-w-[36rem] md:text-[21px]">
                Learn the phrases you need at restaurants, stations, hotels, and
                konbini — with audio, context, and zero setup.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row sm:gap-6">
                <AppleLink onClick={() => goToApp()} primary>
                  Start Learning Free
                </AppleLink>
                <AppleLink href="#community">Follow us</AppleLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={320} className="relative mx-auto mt-12 max-w-[920px] px-4 sm:mt-16 md:mt-20">
            <HeroScreenshot />
          </Reveal>
        </section>

        {/* ── Stats strip ── */}
        <section className="border-y border-white/[0.06] bg-[#1d1d1f] py-10 sm:py-12">
          <div className="mx-auto max-w-[980px] px-6">
            <Reveal>
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-16 md:gap-24">
                <Stat value="100k+" label="Learners across platforms" />
                <div className="hidden h-8 w-px bg-white/10 sm:block" />
                <Stat value="40+" label="Travel situations" />
                <div className="hidden h-8 w-px bg-white/10 sm:block" />
                <Stat
                  value={PHRASE_COUNT.toLocaleString('en-US')}
                  label="Travel phrases included"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Feature sections ── */}
        {FEATURES.map((feature, i) => (
          <section
            key={feature.id}
            className={`relative overflow-hidden py-20 sm:py-28 md:py-32 ${
              i % 2 === 1 ? 'bg-[#1d1d1f]' : 'bg-black'
            }`}
          >
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${feature.accent}`}
            />
            <div className="relative mx-auto max-w-[980px] px-6 text-center">
              <Reveal>
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#a1a1a6]">
                  {feature.eyebrow}
                </p>
                <h2 className="mx-auto mt-3 max-w-[16ch] text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#f5f5f7] sm:max-w-none sm:text-[40px] md:text-[48px]">
                  {feature.title}
                </h2>
                <p className="mx-auto mt-4 max-w-[28rem] text-[17px] leading-[1.47] text-[#a1a1a6] md:max-w-[32rem] md:text-[19px]">
                  {feature.subtitle}
                </p>
              </Reveal>

              {feature.id !== 'context' && (
                <Reveal delay={120} className="mx-auto mt-12 max-w-[640px]">
                  <FeatureVisual id={feature.id} />
                </Reveal>
              )}
            </div>
          </section>
        ))}

        {/* ── Community ── */}
        <section id="community" className="bg-[#1d1d1f] py-20 sm:py-28 md:py-32">
          <div className="mx-auto max-w-[980px] px-6">
            <Reveal className="text-center">
              <h2 className="text-[32px] font-semibold tracking-[-0.03em] text-[#f5f5f7] sm:text-[40px] md:text-[48px]">
                Join our community.
              </h2>
              <p className="mx-auto mt-4 max-w-[28rem] text-[17px] leading-[1.47] text-[#a1a1a6] md:text-[19px]">
                Follow along on YouTube, X, Instagram, and TikTok for travel
                phrases and Japan tips.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[13px] text-[#f5f5f7]/80 transition-all duration-500 hover:bg-white/[0.08]"
                  >
                    <link.icon className="h-3.5 w-3.5 opacity-60" />
                    {link.label}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Closing CTA ── */}
        <section className="border-t border-white/[0.06] bg-[#1d1d1f] py-20 sm:py-24">
          <div className="mx-auto max-w-[980px] px-6 text-center">
            <Reveal>
              <h2 className="text-[32px] font-semibold tracking-[-0.03em] text-[#f5f5f7] sm:text-[40px] md:text-[48px]">
                Ready for Japan?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[17px] text-[#a1a1a6]">
                Your next travel phrase is one tap away.
              </p>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => goToApp()}
                  className="inline-flex items-center gap-1 rounded-full bg-[#2997ff] px-6 py-3 text-[17px] text-white transition-all duration-500 hover:bg-[#40a9ff]"
                >
                  Start Learning Free
                  <ChevronRight className="h-4 w-4 opacity-80" />
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-black pb-8 pt-4">
        <div className="mx-auto max-w-[980px] border-t border-white/[0.08] px-6 pt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <p className="text-[12px] leading-relaxed text-[#636366]">
              Copyright &copy; {new Date().getFullYear()} Japanese Super Words.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-[#a1a1a6]">
              <Link href="/privacy" className="transition-opacity duration-500 hover:text-[#f5f5f7]">
                Privacy Policy
              </Link>
              <a href="#" className="transition-opacity duration-500 hover:text-[#f5f5f7]">
                Terms of Use
              </a>
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity duration-500 hover:text-[#f5f5f7]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Scroll reveal ─── */
function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function AppleLink({
  children,
  href,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
}) {
  const className = `group inline-flex items-center gap-0.5 text-[17px] tracking-[-0.01em] transition-opacity duration-500 hover:opacity-70 ${
    primary ? 'font-medium text-[#2997ff]' : 'text-[#2997ff]'
  }`;

  const chevron = (
    <ChevronRight className="h-[18px] w-[18px] transition-transform duration-500 group-hover:translate-x-0.5" />
  );

  if (href) {
    return (
      <a href={href} className={className}>
        {children}
        {chevron}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
      {chevron}
    </button>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-[40px] font-semibold tracking-[-0.04em] text-[#f5f5f7] sm:text-[48px]">
        {value}
      </p>
      <p className="mt-1 text-[14px] text-[#a1a1a6]">{label}</p>
    </div>
  );
}

function HeroScreenshot() {
  return (
    <div className="relative mx-auto w-full max-w-[780px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[8%] bottom-[5%] top-[15%] rounded-full bg-[#6366f1]/15 blur-3xl"
      />
      <div className="relative animate-intro-float">
        <Image
          src="/images/lp-hero-devices.png"
          alt="Japanese Super Words app on desktop and phone — choose a plan and start learning"
          width={1024}
          height={663}
          priority
          className="h-auto w-full drop-shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        />
      </div>
    </div>
  );
}

function FeatureVisual({ id }: { id: string }) {
  if (id === 'friction') {
    const steps = [
      {
        num: '1',
        title: 'Open the link',
        detail: 'No download. No sign-up. Just open in your browser.',
      },
      {
        num: '2',
        title: 'Pick a situation',
        detail: 'Train station, ramen shop, hotel — choose where you need phrases.',
      },
      {
        num: '3',
        title: 'Tap and listen',
        detail: 'See Japanese, English, and hear native audio right away.',
      },
    ];

    return (
      <div className="overflow-hidden rounded-[20px] border border-white/[0.06] bg-[#161617] p-6 sm:p-8">
        <ol className="space-y-4 text-left">
          {steps.map((step) => (
            <li
              key={step.num}
              className="flex gap-4 rounded-2xl border border-white/[0.06] bg-black/40 px-4 py-4 sm:px-5 sm:py-5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2997ff] text-[14px] font-semibold text-white">
                {step.num}
              </span>
              <div>
                <p className="text-[16px] font-semibold tracking-[-0.02em] text-[#f5f5f7] sm:text-[17px]">
                  {step.title}
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-[#a1a1a6] sm:text-[15px]">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (id === 'anywhere') {
    return (
      <div className="flex justify-center gap-4 sm:gap-6">
        {[
          { icon: Smartphone, label: 'Phone' },
          { icon: Laptop, label: 'Laptop' },
        ].map(({ icon: Icon, label }, i) => (
          <div
            key={label}
            className="flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-[20px] border border-white/[0.06] bg-[#161617] transition-transform duration-700 hover:scale-[1.03] sm:h-32 sm:w-32"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <Icon className="h-8 w-8 text-[#a1a1a6]" strokeWidth={1.5} />
            <span className="text-[12px] text-[#636366]">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

function XSocialIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}
