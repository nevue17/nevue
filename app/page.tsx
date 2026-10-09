import { supabase } from "../lib/supabase";
import { events as fallbackEvents, type EventCardProps } from "./data/events";
import Image from "next/image";
import Link from "next/link";
import { Newsreader } from "next/font/google";

export const dynamic = "force-dynamic";

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
});

type SupabaseEvent = {
  slug: string;
  title: string;
  category: string;
  date: string;
  summary: string | null;
};

function categoryTags(category: string) {
  return category
    .split(/\s*(?:&|,|\/|\|)\s*/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 2);
}

function formatEventDate(value?: string) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function toEventCard(event: SupabaseEvent, index: number): EventCardProps {
  return {
    slug: event.slug,
    category: event.category,
    date: event.date,
    eyebrow: index === 0 ? "Signal 01" : undefined,
    headline: event.title,
    summary: event.summary ?? "",
    tags: categoryTags(event.category),
    featured: index === 0,
  };
}

function EventCard({ slug, category, date, eyebrow, headline, summary, tags, featured = false }: EventCardProps) {
  const eventDate = formatEventDate(date);

  return (
    <article className={`group flex h-full min-w-0 flex-col rounded-[2px] border border-[#e5e5e5] bg-white transition-colors hover:border-[#1d4ed8] ${featured ? "border-l-2 border-l-[#1d4ed8] p-6 sm:p-7 md:p-10" : "p-5 sm:p-6 md:p-7"}`}>
      <div>
        <div className="flex items-center justify-between gap-4 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#666666] md:text-[11px]">
          <span>{category}{eventDate && <><span className="mx-2 text-[#cfcfcf]">/</span>{eventDate}</>}</span>
          {eyebrow && <span className="text-[#1d4ed8]">{eyebrow}</span>}
        </div>
        <h3 className={`${newsreader.className} mt-5 font-medium tracking-[-0.04em] text-[#111111] ${featured ? "max-w-2xl text-[2rem] leading-[1.04] sm:text-3xl md:text-[2.65rem]" : "text-xl leading-[1.12] md:text-[1.45rem]"}`}>
          {headline}
        </h3>
        <p className={`mt-4 font-[Inter,ui-sans-serif,system-ui,sans-serif] leading-7 text-[#666666] ${featured ? "max-w-2xl text-base md:text-lg" : "text-sm md:text-[0.95rem]"}`}>
          {summary}
        </p>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#e5e5e5] pt-5">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="border border-[#e5e5e5] px-2.5 py-1 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#666666]">
              {tag}
            </span>
          ))}
        </div>
        <Link href={`/understand/${slug}`} className="shrink-0 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-sm font-semibold text-[#111111] underline decoration-[#cfcfcf] underline-offset-4 transition-colors hover:text-[#1d4ed8] hover:decoration-[#1d4ed8]">
          Understand <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}

function CategoryLinks({ mobile = false }: { mobile?: boolean }) {
  const links = [
    { label: "Markets", href: "/markets" },
    { label: "Business", href: "/business" },
    { label: "Economy", href: "/economy" },
    { label: "Global", href: "/global" },
  ];

  if (mobile) {
    return (
      <details className="relative md:hidden">
        <summary
          className="flex h-10 w-10 cursor-pointer list-none items-center justify-center text-[#111111] [&::-webkit-details-marker]:hidden"
          aria-label="Open navigation"
        >
          <span className="sr-only">Open navigation</span>
          <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
          </span>
        </summary>

        <div className="absolute right-0 top-12 z-10 w-48 border border-[#e5e5e5] bg-white p-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2.5 text-sm font-medium text-[#666666] transition-colors hover:bg-slate-50 hover:text-[#111111]"
            >
              {item.label}
            </Link>
          ))}

          <a
            href="#top"
            className="block border-t border-[#e5e5e5] px-3 py-2.5 text-sm font-medium text-[#111111] transition-colors hover:bg-slate-50"
          >
            About
          </a>
        </div>
      </details>
    );
  }

  return (
    <div className="hidden items-center gap-8 md:flex">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-[#666666] transition-colors hover:text-[#111111]"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export default async function Home() {
  const { data, error } = await supabase
    .from("events")
    .select("slug, title, category, date, summary")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5);

  const events = !error && data?.length
    ? (data as SupabaseEvent[]).map(toEventCard)
    : fallbackEvents;
  const featuredEvent = events[0];
  const supportingEvents = events.slice(1);

  return (
    <main className="min-h-screen bg-[#fafaf9] text-slate-950">
      <nav className="border-b border-[#e5e5e5] bg-white font-[Inter,ui-sans-serif,system-ui,sans-serif]" aria-label="Main navigation">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-8 px-6 lg:px-10">
          <a href="#top" className="shrink-0">
            <Image src="/nevue-logo.png" alt="Nevue" width={2172} height={724} className="h-8 w-auto object-contain" />
          </a>
          <CategoryLinks />
          <a href="#top" className="hidden text-sm font-medium text-[#111111] transition-colors hover:text-[#1d4ed8] md:block">
            About
          </a>
          <CategoryLinks mobile />
        </div>
      </nav>

      <div id="top">
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 pb-16 pt-16 sm:pb-24 sm:pt-20 lg:px-10 lg:pb-32 lg:pt-28">
          <div className="max-w-4xl">
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1d4ed8]">Global events intelligence</p>
            <h1 className={`${newsreader.className} max-w-4xl text-[3rem] font-medium leading-[0.94] tracking-[-0.055em] text-[#111111] sm:text-6xl lg:text-[6.75rem]`}>
              Understand the events moving the world.
            </h1>
            <p className="mt-8 max-w-2xl font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[1.05rem] leading-8 text-[#666666] md:text-xl">
              Nevue turns fast-moving global events into clear, useful intelligence for understanding their financial, business, and market impact.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-2 border-t border-[#e5e5e5] pt-5 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[10px] font-semibold uppercase tracking-[0.17em] text-[#666666] sm:mt-20 sm:flex sm:justify-between sm:text-xs">
            <span>Updated continuously</span>
            <span className="text-right">Signal over noise</span>
          </div>
          </div>
        </section>

        <section id="briefing" className="bg-white">
          <div className="mx-auto max-w-7xl px-6 pb-20 sm:pb-24 lg:px-10 lg:pb-32">
          <div className="mb-8 flex items-end justify-between gap-5 border-b border-[#e5e5e5] pb-5 md:mb-10">
            <div>
              <p className="mb-3 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1d4ed8]">The briefing</p>
              <h2 className={`${newsreader.className} text-[2.75rem] font-medium tracking-[-0.045em] text-[#111111] sm:text-4xl md:text-5xl`}>What Matters Now</h2>
            </div>
            <span className="hidden font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#666666] sm:block">05 signals</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
            <div className="lg:row-span-2">
              <EventCard {...featuredEvent} />
            </div>
            {supportingEvents.slice(0, 4).map((event) => (
              <EventCard key={event.headline} {...event} />
            ))}
          </div>
          </div>
        </section>
      </div>

      <footer id="understand" className="border-t border-[#e5e5e5] bg-white font-[Inter,ui-sans-serif,system-ui,sans-serif]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 text-sm text-[#666666] lg:px-10 lg:py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <a href="#top" aria-label="Nevue home" className="inline-block">
                <Image src="/nevue-logo.png" alt="Nevue" width={2172} height={724} className="h-7 w-auto object-contain" />
              </a>
              <p className="mt-4 leading-6">Clarity for a changing world.</p>
            </div>
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#111111]">
              <a href="#top" className="transition-colors hover:text-[#1d4ed8]">About</a>
              <a href="#briefing" className="transition-colors hover:text-[#1d4ed8]">Sources / Methodology</a>
              <a href="#top" className="transition-colors hover:text-[#1d4ed8]">Privacy</a>
              <a href="#top" className="transition-colors hover:text-[#1d4ed8]">Terms</a>
            </nav>
          </div>
          <div className="border-t border-[#e5e5e5] pt-5 text-xs text-[#666666]">&copy; 2026 Nevue. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}

