import Link from "next/link";
import { supabase } from "@/lib/supabase";

type EventRecord = {
  slug: string;
  title: string;
  category?: string | null;
  summary?: string | null;
  description?: string | null;
};

export type CategoryPageConfig = {
  title: string;
  description: string;
  categories: string[];
};

export default async function CategoryPage({
  config,
}: {
  config: CategoryPageConfig;
}) {
  const query = supabase.from("events").select("*");
  const { data, error } = config.categories.length
    ? await query.in("category", config.categories)
    : { data: [], error: null };

  const events = (data ?? []) as EventRecord[];

  return (
    <main style={{ background: "#fff", color: "#111", minHeight: "100vh" }}>
      <section
        style={{
          borderBottom: "1px solid #E5E5E5",
          margin: "0 auto",
          maxWidth: 1120,
          padding: "72px 24px 40px",
        }}
      >
        <p
          style={{
            color: "#1D4ED8",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          Nevue briefing
        </p>
        <h1
          style={{
            fontFamily: "Newsreader, Georgia, serif",
            fontSize: "clamp(42px, 7vw, 72px)",
            fontWeight: 400,
            letterSpacing: "-0.04em",
            lineHeight: 0.98,
            margin: "18px 0 16px",
          }}
        >
          {config.title}
        </h1>
        <p
          style={{
            color: "#666",
            fontSize: 17,
            lineHeight: 1.6,
            margin: 0,
            maxWidth: 680,
          }}
        >
          {config.description}
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          margin: "0 auto",
          maxWidth: 1120,
          padding: "32px 24px 80px",
        }}
      >
        {error ? (
          <p style={{ color: "#666", gridColumn: "1 / -1" }}>
            We couldn’t load this briefing right now. Please try again shortly.
          </p>
        ) : events.length === 0 ? (
          <p style={{ color: "#666", gridColumn: "1 / -1" }}>
            There are no stories in this briefing yet.
          </p>
        ) : (
          events.map((event) => (
            <Link
              href={`/understand/${event.slug}`}
              key={event.slug}
              style={{
                border: "1px solid #E5E5E5",
                color: "inherit",
                display: "block",
                padding: 24,
                textDecoration: "none",
              }}
            >
              <p
                style={{
                  color: "#1D4ED8",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  margin: "0 0 18px",
                  textTransform: "uppercase",
                }}
              >
                {event.category}
              </p>
              <h2
                style={{
                  fontFamily: "Newsreader, Georgia, serif",
                  fontSize: 30,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.08,
                  margin: 0,
                }}
              >
                {event.title}
              </h2>
              {(event.summary || event.description) && (
                <p style={{ color: "#666", lineHeight: 1.55, margin: "16px 0 0" }}>
                  {event.summary || event.description}
                </p>
              )}
            </Link>
          ))
        )}
      </section>
    </main>
  );
}
