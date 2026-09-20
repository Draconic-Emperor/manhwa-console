import { Link } from "react-router";
import { useQuery } from "convex/react";
import {
  ArrowRight,
  BookOpen,
  FolderHeart,
  KeyRound,
  ScrollText,
  Search,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Manhwa } from "@/lib/codex";
import { CoverImage } from "@/components/ui/CoverImage";
import { ConsoleSeal } from "@/components/layout/BrandMark";

const FEATURES = [
  {
    icon: BookOpen,
    title: "The series archive",
    text: "Inscribe manhwa into the archive with covers, lore, status, and rank — browsable, filterable, alive.",
  },
  {
    icon: Users,
    title: "Entity registry",
    text: "Catalog every hero, villain, and supporting soul, bound to their world and ranked by the researchers.",
  },
  {
    icon: Trophy,
    title: "Rankings",
    text: "A living ladder in Mythic, Legendary, Elite, and Rising tiers — settled by readers, not editors.",
  },
  {
    icon: ScrollText,
    title: "Chronicles",
    text: "Seal lore breakdowns, reviews, and fan theories onto any entity's record for future researchers.",
  },
  {
    icon: FolderHeart,
    title: "Collections",
    text: "Seal series and entities into your personal vault with a single touch of the heart.",
  },
  {
    icon: Search,
    title: "Query Archive",
    text: "Press Ctrl + K anywhere to summon records, entities, and chronicles from the whole archive.",
  },
];

const STEPS = [
  { n: "I", title: "Inscribe", text: "Add a manhwa series — title, author, lore, rank, status." },
  { n: "II", title: "Catalog", text: "Bind its entities into the registry with portraits and ranks." },
  { n: "III", title: "Chronicle", text: "Seal theories and lore; the archive remembers every entry." },
];

export default function Landing() {
  const manhwa = useQuery(api.manhwa.list) as Manhwa[] | undefined;
  const characters = useQuery(api.characters.list);

  const featured = (manhwa ?? []).slice(0, 5);
  const seriesCount = manhwa?.length ?? 0;
  const charCount = characters?.length ?? 0;

  return (
    <div className="relative min-h-dvh">
      <div className="console-ambient" aria-hidden="true" />
      <div className="console-fog" aria-hidden="true" />
      <div className="console-particles" aria-hidden="true" />

      {/* ============ Nav ============ */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-obsidian/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-10">
          <Link
            to="/"
            className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Manhwa Console home"
          >
            <span className="relative flex size-9 items-center justify-center rounded-xl border border-amethyst/30 bg-void shadow-[0_0_18px_-4px_var(--crimson-glow)] transition-transform duration-300 group-hover:rotate-6">
              <ConsoleSeal className="size-5" />
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="font-display block text-sm font-bold leading-tight tracking-[0.18em] text-parchment">
                MANHWA
              </span>
              <span className="text-gradient-amethyst font-display block text-[10px] font-semibold leading-tight tracking-[0.42em]">
                CONSOLE
              </span>
            </span>
          </Link>

          <nav aria-label="Landing sections" className="ml-6 hidden items-center gap-6 text-sm text-text-2 lg:flex">
            <a href="#features" className="transition-colors hover:text-parchment">The Archive</a>
            <a href="#showcase" className="transition-colors hover:text-parchment">Records</a>
            <a href="#ritual" className="transition-colors hover:text-parchment">The Ritual</a>
          </nav>

          <div className="flex-1" />
          <Link to="/auth?returnTo=%2Fdashboard" className="btn-amethyst px-4 py-2 text-sm sm:px-5 sm:py-2.5">
            Enter the Archive <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main id="main">
        {/* ============ Hero ============ */}
        <section className="relative flex min-h-[92vh] items-center overflow-hidden" aria-labelledby="hero-heading">
          {/* Dark fantasy backdrop */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="ember-breathe absolute left-1/2 top-[-25%] size-[46rem] -translate-x-1/2 rounded-full bg-crimson/20 blur-[130px]" />
            <div className="absolute right-[-12%] top-[25%] size-[30rem] rounded-full bg-crimson/10 blur-[120px]" />
            <div className="absolute bottom-[-35%] left-[-12%] size-[32rem] rounded-full bg-amethyst/8 blur-[120px]" />
            <div
              className="absolute inset-0 opacity-[0.13]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(167, 139, 250,0.16) 0 1px, transparent 1px 96px)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian to-transparent" />
          </div>

          <div className="relative mx-auto w-full max-w-4xl px-4 py-24 text-center sm:px-6">
            <div className="sigil-rise flex justify-center">
              <span className="relative flex size-20 items-center justify-center rounded-3xl border border-amethyst/35 bg-void/80 shadow-[0_0_60px_-12px_var(--crimson-glow)]">
                <ConsoleSeal className="size-12" />
              </span>
            </div>

            <p className="kicker rise-in mt-8 justify-center" style={{ animationDelay: "80ms" }}>
              A forbidden archive of manhwa records
            </p>

            <h1
              id="hero-heading"
              className="font-display rise-in mt-5 text-5xl font-bold leading-[1.04] tracking-tight sm:text-7xl lg:text-8xl"
              style={{ animationDelay: "140ms" }}
            >
              <span className="text-gradient-amethyst">MANHWA CONSOLE</span>
            </h1>

            <p
              className="font-display rise-in mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-parchment/85 sm:text-2xl"
              style={{ animationDelay: "220ms" }}
            >
              Access the Archive. Discover Worlds. Uncover Legends.
            </p>

            <p
              className="rise-in mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-2 sm:text-base"
              style={{ animationDelay: "300ms" }}
            >
              Every series ever written, every entity ever named — sealed within these records.
              The archive opens only for those who seek.
            </p>

            <div
              className="rise-in mt-10 flex flex-wrap items-center justify-center gap-4"
              style={{ animationDelay: "380ms" }}
            >
              <Link to="/auth?returnTo=%2Fdashboard" className="btn-amethyst px-8 py-3.5 text-sm sm:text-base">
                <KeyRound className="size-4" aria-hidden="true" /> ENTER THE ARCHIVE
              </Link>
              <Link to="/auth?returnTo=%2Fchronicles" className="btn-ember px-8 py-3.5 text-sm sm:text-base">
                <ScrollText className="size-4" aria-hidden="true" /> EXPLORE CHRONICLES
              </Link>
            </div>

            {/* Live archive stats */}
            <dl
              className="rise-in mx-auto mt-14 grid max-w-lg grid-cols-3 gap-4"
              style={{ animationDelay: "460ms" }}
            >
              {[
                { label: "Records", value: seriesCount },
                { label: "Entities", value: charCount },
                { label: "Chronicles", value: "∞" },
              ].map((s) => (
                <div key={s.label} className="panel px-4 py-3 text-center">
                  <dd className="font-display text-2xl font-bold tabular-nums text-parchment">{s.value}</dd>
                  <dt className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-3">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ============ Features ============ */}
        <section
          id="features"
          className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-10 lg:py-24"
          aria-labelledby="features-heading"
        >
          <div className="max-w-2xl">
            <p className="kicker">What lies within</p>
            <h2 id="features-heading" className="font-display mt-3 text-3xl font-bold tracking-tight text-parchment sm:text-4xl">
              Chambers of hidden knowledge
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-2 sm:text-base">
              Not a database — a repository. Every record was written, ranked, and argued over by the
              researchers who came before you.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <article key={f.title} className="record hover-lift p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-amethyst/30 bg-crimson/12 text-amethyst shadow-[0_0_18px_-6px_var(--crimson-glow)]">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display mt-4 text-lg font-semibold text-parchment">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-2">{f.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ============ Showcase ============ */}
        <section
          id="showcase"
          className="scroll-mt-24 border-y border-border/70 bg-void/60 py-16 lg:py-24"
          aria-labelledby="showcase-heading"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="kicker">Straight from the vault</p>
                <h2 id="showcase-heading" className="font-display mt-3 text-3xl font-bold tracking-tight text-parchment sm:text-4xl">
                  Recently sealed records
                </h2>
              </div>
              <Link
                to="/auth?returnTo=%2Fseries"
                className="inline-flex items-center gap-1 text-sm font-medium text-amethyst transition-colors hover:text-[#dccbfb]"
              >
                Open the full archive <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            {manhwa === undefined ? (
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="panel overflow-hidden">
                    <div className="skeleton aspect-[2/3] w-full rounded-b-none" />
                    <div className="space-y-2 p-3">
                      <div className="skeleton h-4 w-3/4" />
                      <div className="skeleton h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : featured.length === 0 ? (
              <div className="panel mt-8 flex flex-col items-center gap-3 px-6 py-14 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl border border-amethyst/30 bg-crimson/10 text-amethyst">
                  <BookOpen className="size-6" />
                </span>
                <p className="font-display text-lg font-semibold text-parchment">The first shelf awaits</p>
                <p className="max-w-sm text-sm text-text-2">
                  No records have been sealed yet. Enter the archive and write the first entry.
                </p>
                <Link to="/auth?returnTo=%2Fdashboard" className="btn-amethyst mt-2 px-5 py-2.5 text-sm">
                  <Sparkles className="size-4" aria-hidden="true" /> Inscribe a series
                </Link>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {featured.map((m) => (
                  <Link
                    key={m._id}
                    to="/auth?returnTo=%2Fseries"
                    className="group record hover-lift focus-visible:ring-ring relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={`Open archive entry: ${m.title}`}
                  >
                    <div className="media-zoom relative aspect-[2/3] w-full">
                      <CoverImage src={m.cover_image} seed={m._id} ratio="portrait" alt="" />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/15 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <span className="inline-flex rounded-full border border-amethyst/40 bg-amethyst/15 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[#dccbfb]">
                          ◆ Rank {m.rank}
                        </span>
                        <h3 className="font-display mt-2 line-clamp-2 text-sm font-semibold leading-snug text-parchment transition-colors group-hover:text-amethyst">
                          {m.title}
                        </h3>
                        <p className="truncate text-[11px] text-parchment/65">{m.author}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ============ Ritual ============ */}
        <section
          id="ritual"
          className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-10 lg:py-24"
          aria-labelledby="ritual-heading"
        >
          <div className="max-w-2xl">
            <p className="kicker">The researcher's ritual</p>
            <h2 id="ritual-heading" className="font-display mt-3 text-3xl font-bold tracking-tight text-parchment sm:text-4xl">
              Three vows, one archive
            </h2>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="record relative p-6">
                <span aria-hidden="true" className="font-display text-gradient-amethyst text-4xl font-bold">
                  {s.n}
                </span>
                <h3 className="font-display mt-3 text-lg font-semibold text-parchment">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-2">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ============ Final CTA ============ */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-10 lg:pb-28" aria-labelledby="cta-heading">
          <div className="record relative overflow-hidden px-6 py-14 text-center sm:px-10 lg:py-20">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="ember-breathe absolute left-1/2 top-1/2 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson/15 blur-[110px]" />
              <div className="absolute bottom-[-40%] left-[-10%] size-[26rem] rounded-full bg-amethyst/8 blur-[110px]" />
            </div>
            <div className="relative flex flex-col items-center gap-5">
              <span className="flex size-14 items-center justify-center rounded-2xl border border-amethyst/35 bg-void shadow-[0_0_30px_-8px_var(--crimson-glow)]">
                <ConsoleSeal className="size-8" />
              </span>
              <h2 id="cta-heading" className="font-display max-w-2xl text-3xl font-bold tracking-tight text-parchment sm:text-5xl">
                The archive remembers <span className="text-gradient-amethyst">those who write</span>
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-text-2 sm:text-base">
                Sign in with email or continue as a wandering researcher — the archive opens the moment you do.
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
                <Link to="/auth?returnTo=%2Fdashboard" className="btn-amethyst px-7 py-3 text-base">
                  <KeyRound className="size-4" aria-hidden="true" /> ENTER THE ARCHIVE
                </Link>
                <Link to="/auth?returnTo=%2Fcharacters" className="btn-ember px-7 py-3 text-base">
                  <Users className="size-4" aria-hidden="true" /> Meet the Entities
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============ Footer ============ */}
      <footer className="border-t border-border/70 py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 text-xs text-text-3 sm:px-6 lg:px-10">
          <p className="flex items-center gap-2">
            <ConsoleSeal className="size-4" />
            Manhwa Console — Access the Archive. Discover Worlds. Uncover Legends.
          </p>
          <p>
            Press{" "}
            <kbd className="rounded border border-border bg-panel px-1 py-0.5 font-mono text-[10px]">Ctrl</kbd>{" "}
            +{" "}
            <kbd className="rounded border border-border bg-panel px-1 py-0.5 font-mono text-[10px]">K</kbd>{" "}
            inside to query the archive.
          </p>
        </div>
      </footer>
    </div>
  );
}
