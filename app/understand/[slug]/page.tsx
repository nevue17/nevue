import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Newsreader } from "next/font/google";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: event } = await supabase
    .from("events")
    .select("title, summary")
    .eq("slug", slug)
    .maybeSingle();

  if (!event) return {};

  const title = `${event.title} — Nevue`;
  const description = event.summary;
  const url = `/understand/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "Nevue",
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: "Nevue — Understand the Events Moving the World",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.svg"],
    },
  };
}

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
});

type EventSource = {
  publisher?: string;
  title?: string;
  published?: string;
  url?: string;
};

type SupabaseEvent = {
  title: string;
  category: string;
  date: string;
  summary: string | null;
  what_happened: string | null;
  why_it_happened: string | null;
  how_it_works: string | null;
  why_it_matters: string | null;
  financial_impact: string | null;
  business_impact: string | null;
  market_impact: string | null;
  what_next: string | null;
  sources: EventSource[] | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`));
}

function safeSourceUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function ImpactPanel({ title, body }: { title: string; body: string | null }) {
  return (
    <div className="border-t border-[#e5e5e5] pt-5">
      <h3 className="font-[Inter,ui-sans-serif,system-ui,sans-serif] text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">{title}</h3>
      <p className="mt-4 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-base leading-8 text-[#666666]">{body}</p>
    </div>
  );
}

export default async function UnderstandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data, error } = await supabase
    .from("events")
    .select("title, category, date, summary, what_happened, why_it_happened, how_it_works, why_it_matters, financial_impact, business_impact, market_impact, what_next, sources")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) notFound();

  const event = data as SupabaseEvent;
  const sources = event.sources ?? [];

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <header className="border-b border-[#e5e5e5] bg-white">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
          <Link href="/" className="text-xl font-bold tracking-[-0.055em] text-slate-950">
            <Image src="/nevue-logo.png" alt="Nevue" width={2172} height={724} className="h-7 w-auto object-contain" />
          </Link>
          <Link href="/" className="font-[Inter,ui-sans-serif,system-ui,sans-serif] text-sm font-medium text-[#666666] underline decoration-[#cfcfcf] underline-offset-4 transition-colors hover:text-[#1d4ed8]">
            <span aria-hidden="true">&larr;</span> Back to Nevue
          </Link>
        </div>
      </header>

      <article>
        <section className="border-b border-[#e5e5e5] bg-white">
          <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pb-28 lg:pt-24">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#666666]">
              <span className="text-[#1d4ed8]">{event.category}</span>
              <span className="text-[#cfcfcf]">/</span>
              <time dateTime={event.date}>{formatDate(event.date)}</time>
            </div>
            <h1 className={`${newsreader.className} mt-7 max-w-4xl text-[3.25rem] font-medium leading-[0.96] tracking-[-0.055em] sm:text-6xl lg:text-[6.5rem]`}>
              {event.title}
            </h1>
            <p className="mt-8 max-w-2xl font-[Inter,ui-sans-serif,system-ui,sans-serif] text-lg leading-8 text-[#666666] md:text-xl">{event.summary}</p>
          </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-24 lg:px-10 lg:py-24">
            <div className="space-y-16 md:space-y-20">
              <section className="grid gap-5 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10">
                <p className="font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.17em] text-[#1d4ed8]">01 / What Happened</p>
                <div className="max-w-2xl"><h2 className={`${newsreader.className} text-3xl font-medium leading-tight tracking-[-0.035em]`}>What Happened</h2><p className="mt-5 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-base leading-8 text-[#666666] md:text-lg">{event.what_happened}</p></div>
              </section>
              <section className="grid gap-5 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10">
                <p className="font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.17em] text-[#1d4ed8]">02 / Why It Happened</p>
                <div className="max-w-2xl"><h2 className={`${newsreader.className} text-3xl font-medium leading-tight tracking-[-0.035em]`}>Why It Happened</h2><p className="mt-5 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-base leading-8 text-[#666666] md:text-lg">{event.why_it_happened}</p></div>
              </section>
              <section className="grid gap-5 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10">
                <p className="font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.17em] text-[#1d4ed8]">03 / How It Works</p>
                <div className="max-w-2xl"><h2 className={`${newsreader.className} text-3xl font-medium leading-tight tracking-[-0.035em]`}>How It Works</h2><p className="mt-5 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-base leading-8 text-[#666666] md:text-lg">{event.how_it_works}</p></div>
              </section>
              <section className="grid gap-5 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10">
                <p className="font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.17em] text-[#1d4ed8]">04 / Why It Matters</p>
                <div className="max-w-2xl"><h2 className={`${newsreader.className} text-3xl font-medium leading-tight tracking-[-0.035em]`}>Why It Matters</h2><p className="mt-5 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-base leading-8 text-[#666666] md:text-lg">{event.why_it_matters}</p></div>
              </section>

              <section className="grid gap-5 border-t border-[#e5e5e5] pt-16 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10 md:pt-20">
                <p className="font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.17em] text-[#1d4ed8]">05 / Financial Impact</p>
                <div className="max-w-2xl">
                  <h2 className={`${newsreader.className} text-3xl font-medium leading-tight tracking-[-0.035em] md:text-4xl`}>Financial Impact</h2>
                  <div className="mt-8 grid gap-8 sm:grid-cols-2">
                    <ImpactPanel title="Financial Impact" body={event.financial_impact} />
                    <ImpactPanel title="Market Impact" body={event.market_impact} />
                  </div>
                </div>
              </section>

              <section className="grid gap-5 border-t border-[#e5e5e5] pt-16 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10 md:pt-20">
                <p className="font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.17em] text-[#1d4ed8]">06 / Business Impact</p>
                <div className="max-w-2xl">
                  <h2 className={`${newsreader.className} text-3xl font-medium leading-tight tracking-[-0.035em] md:text-4xl`}>Business Impact</h2>
                  <p className="mt-5 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-base leading-8 text-[#666666] md:text-lg">{event.business_impact}</p>
                </div>
              </section>

              <section className="grid gap-5 border-t border-[#e5e5e5] pt-16 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10 md:pt-20">
                <p className="font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.17em] text-[#1d4ed8]">07 / What Happens Next</p>
                <div className="max-w-2xl">
                  <h2 className={`${newsreader.className} text-3xl font-medium leading-tight tracking-[-0.035em] md:text-4xl`}>What Happens Next</h2>
                  <p className="mt-5 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-base leading-8 text-[#666666] md:text-lg">{event.what_next}</p>
                </div>
              </section>

              <section className="grid gap-5 border-t border-[#e5e5e5] pt-16 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10 md:pt-20">
                <p className="font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.17em] text-[#1d4ed8]">08 / Sources</p>
                <div className="max-w-2xl">
                  <h2 className={`${newsreader.className} text-3xl font-medium leading-tight tracking-[-0.035em] md:text-4xl`}>Sources &amp; Notes</h2>
                  <div className="mt-8 font-[Inter,ui-sans-serif,system-ui,sans-serif]">
                    {sources.map((source) => (
                      <div key={`${source.publisher}-${source.title}`} className="flex flex-col border-t border-[#e5e5e5] py-4 text-sm leading-6 text-[#666666] sm:block">
                        {safeSourceUrl(source.url) ? <a href={safeSourceUrl(source.url) ?? undefined} target="_blank" rel="noreferrer" className="font-medium text-[#111111] underline decoration-[#cfcfcf] underline-offset-4 transition-colors hover:text-[#1d4ed8] hover:decoration-[#1d4ed8]">{source.title ?? source.publisher}</a> : <span className="font-medium text-[#111111]">{source.title ?? source.publisher}</span>}
                        {(source.publisher || source.published) && <span className="ml-2 text-slate-400">{[source.publisher, source.published].filter(Boolean).join(" · ")}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <aside className="h-fit border-t border-[#e5e5e5] pt-5 font-[Inter,ui-sans-serif,system-ui,sans-serif] lg:sticky lg:top-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">At a glance</p>
              <dl className="mt-6 space-y-5 text-sm">
                <div className="flex justify-between gap-4 border-b border-[#e5e5e5] pb-4"><dt className="text-[#666666]">Category</dt><dd className="max-w-[12rem] text-right font-medium text-[#111111]">{event.category}</dd></div>
                <div className="flex justify-between gap-4 border-b border-[#e5e5e5] pb-4"><dt className="text-[#666666]">Published</dt><dd className="max-w-[12rem] text-right font-medium text-[#111111]">{formatDate(event.date)}</dd></div>
                <div className="flex justify-between gap-4 border-b border-[#e5e5e5] pb-4"><dt className="text-[#666666]">Sources</dt><dd className="max-w-[12rem] text-right font-medium text-[#111111]">{sources.length}</dd></div>
              </dl>
            </aside>
          </div>
        </section>
      </article>

      <footer className="border-t border-[#e5e5e5] bg-white font-[Inter,ui-sans-serif,system-ui,sans-serif]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 text-sm text-[#666666] lg:px-10 lg:py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <Link href="/" aria-label="Nevue home" className="inline-block">
                <Image src="/nevue-logo.png" alt="Nevue" width={2172} height={724} className="h-7 w-auto object-contain" />
              </Link>
              <p className="mt-4 leading-6">Clarity for a changing world.</p>
            </div>
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#111111]">
              <Link href="/" className="transition-colors hover:text-[#1d4ed8]">About</Link>
              <Link href="/" className="transition-colors hover:text-[#1d4ed8]">Sources / Methodology</Link>
              <Link href="/" className="transition-colors hover:text-[#1d4ed8]">Privacy</Link>
              <Link href="/" className="transition-colors hover:text-[#1d4ed8]">Terms</Link>
            </nav>
          </div>
          <div className="border-t border-[#e5e5e5] pt-5 text-xs text-[#666666]">&copy; 2026 Nevue. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
