import { Link } from "react-router";
import { useQuery } from "convex/react";
import {
  ArrowRight,
  BookOpen,
  FolderHeart,
  Search,
  ScrollText,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Manhwa } from "@/lib/codex";
import { CoverImage } from "@/components/ui/CoverImage";
import { CodexSigil } from "@/components/layout/BrandMark";

const FEATURES = [
  {
    icon: BookOpen,
    title: "The series archive",
    text: "Inscribe manhwa into the codex with covers, lore, status, and rank — browsable, filterable, alive.",
  },
  {
    icon: Users,
    title: "Character registry",
    text: "Catalog every hero, villain, and supporting soul, bound to their world and ranked by the community.",
  },
  {
    icon: Trophy,
    title: "Power rankings",
    text: "A living ladder in Mythic, Legendary, Elite, and Rising tiers — settled by readers, not editors.",
  },
  {
    icon: ScrollText,
    title: "Insights & theories",
    text: "Seal lore breakdowns, reviews, and fan theories onto any character's page for future readers.",
  },
  {
    icon: FolderHeart,
    title: "Collections",
    text: "Save series and characters into your personal wing of the archive with a single tap of the heart.",
  },
  {
    icon: Search,
    title: "Search everything",
    text: "Press Ctrl + K anywhere to conjure series, characters, and insights from the whole archive.",
  },
];

const STEPS = [
  { n: "I", title: "Inscribe", text: "Add a manhwa series — title, author, lore, rank, status." },
  { n: "II", title: "Catalog", text: "Bind its cast into the registry with portraits and power ranks." },
  { n: "III", title: "Debate", text: "Share theories and lore; the codex remembers every entry." },
];

export default function Landing() {
  const manhwa = useQuery(api.manhwa.list) as Manhwa[] | undefined;
  const characters = useQuery(api.characters.list);

  const featured = (manhwa ?? []).slice(0, 5);
  const seriesCount = manhwa?.length ?? 0;
  const charCount = characters?.length ?? 0;

  return (
    <div className="relative min-h-dvh">
      <div className="codex-ambient" aria-hidden="true" />

      {/* ============ Nav ============ */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-10">
          <Link
            to="/"
            className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Manhwa Codex home"
          >
            <span className="relative flex size-9 items-center justify-center rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-400/15 to-fuchsia-400/5 shadow-[0_0_18px_-4px_var(--violet-glow)] transition-transform duration-300 group-hover:rotate-6">
              <CodexSigil className="size-5" />
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="font-display block text-sm font-bold leading-tight tracking-[0.18em] text-foreground">
                MANHWA
              </span>
              <span className="text-gradient-gold font-display block text-[10px] font-semibold leading-tight tracking-[0.42em]">
                CODEX
              </span>
            </span>
          </Link>

          <nav aria-label="Landing sections" className="ml-6 hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#showcase" className="transition-colors hover:text-foreground">The archive</a>
            <a href="#ritual" className="transition-colors hover:text-foreground">How it works</a>
          </nav>

          <div className="flex-1" />
          <Link to="/auth?returnTo=%2Fdashboard" className="btn-arcane px-4 py-2 text-sm sm:px-5 sm:py-2.5">
            Enter the Codex <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main id="main">
        {/* ============ Hero ============ */}
        <section className="relative overflow-hidden" aria-labelledby="hero-heading">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-20%] size-[42rem] -translate-x-1/2 rounded-full bg-violet-500/12 blur-[120px]" />
            <div className="absolute right-[-10%] top-[30%] size-[28rem] rounded-full bg-fuchsia-500/10 blur-[110px]" />
            <div className="absolute bottom-[-30%] left-[-10%] size-[30rem] rounded-full bg-amber-400/8 blur-[110px]" />
          </div>

          <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-24">
            <div className="rise-in">
              <p className="kicker">A community-driven archive</p>
              <h1
                id="hero-heading"
                className="font-display mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
              >
                Every world.
                <br />
                Every hero.
                <br />
                <span className="text-gradient-arcane">One Codex.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-text-2 sm:text-lg">
                Manhwa Codex is a dark-fantasy archive where readers inscribe series, catalog
                characters, settle power rankings, and seal their best theories — a living lore
                compendium kept by the people who love it.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/auth?returnTo=%2Fdashboard" className="btn-arcane px-6 py-3 text-sm sm:text-base">
                  <Sparkles className="size-4" aria-hidden="true" /> Open the archive
                </Link>
                <a
                  href="#showcase"
                  className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-violet-400/40 hover:text-violet-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-base"
                >
                  <BookOpen className="size-4" aria-hidden="true" /> See what's inside
                </a>
              </div>

              {/* Live archive stats */}
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
                {[
                  { label: "Series", value: seriesCount },
                  { label: "Characters", value: charCount },
                  { label: "Open to all", value: "∞" },
                ].map((s) => (
                  <div key={s.label} className="panel px-4 py-3 text-center">
                    <dt className="order-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {s.label}
                    </dt>
                    <dd className="font-display order-1 text-2xl font-bold tabular-nums text-foreground">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Floating cover spread */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
              <div className="relative mx-auto grid w-fit grid-cols-3 gap-4 [perspective:1200px]">
                {[
                  { seed: "codex-hero-1", rotate: "-8deg", y: "24px", z: "z-10" },
                  { seed: "codex-hero-2", rotate: "0deg", y: "0px", z: "z-20" },
                  { seed: "codex-hero-3", rotate: "8deg", y: "24px", z: "z-10" },
                ].map((c, i) => (
                  <div
                    key={c.seed}
                    className={`${c.z} rise-in`}
                    style={{
                      animationDelay: `${i * 120}ms`,
                      transform: `rotate(${c.rotate}) translateY(${c.y})`,
                    }}
                  >
                    <div className="w-28 overflow-hidden rounded-xl border border-white/15 shadow-[var(--shadow-card-hover)] sm:w-36">
                      <div className="aspect-[2/3]">
                        <CoverImage src={null} seed={c.seed} ratio="portrait" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Arcane art — conjured for every entry without a cover
              </p>
            </div>
          </div>
        </section>

        {/* ============ Features ============ */}
        <section id="features" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="features-heading">
          <div className="max-w-2xl">
            <p className="kicker">What lives inside</p>
            <h2 id="features-heading" className="font-display mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              An archive with a soul
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-2 sm:text-base">
              Not a dashboard — a compendium. Every page is written, ranked, and argued over by the
              readers who came before you.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <article key={f.title} className="panel hover-lift p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-violet-400/25 bg-violet-400/10 text-violet-bright shadow-[0_0_18px_-6px_var(--violet-glow)]">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display mt-4 text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ============ Showcase ============ */}
        <section id="showcase" className="scroll-mt-24 border-y border-border/70 bg-ink-2/60 py-16 lg:py-24" aria-labelledby="showcase-heading">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="kicker">Straight from the shelves</p>
                <h2 id="showcase-heading" className="font-display mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Recently inscribed
                </h2>
              </div>
              <Link
                to="/auth?returnTo=%2Fseries"
                className="inline-flex items-center gap-1 text-sm font-medium text-violet-bright transition-colors hover:text-magenta"
              >
                Browse the full archive <ArrowRight className="size-4" aria-hidden="true" />
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
                <span className="flex size-14 items-center justify-center rounded-2xl border border-violet-400/25 bg-violet-400/10 text-violet-bright">
                  <BookOpen className="size-6" />
                </span>
                <p className="font-display text-lg font-semibold">The first shelf awaits</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  No series have been inscribed yet. Enter the codex and write the first entry.
                </p>
                <Link to="/auth?returnTo=%2Fdashboard" className="btn-gold mt-2 px-5 py-2.5 text-sm">
                  <Sparkles className="size-4" aria-hidden="true" /> Inscribe a series
                </Link>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {featured.map((m) => (
                  <Link
                    key={m._id}
                    to="/auth?returnTo=%2Fseries"
                    className="group panel hover-lift focus-visible:ring-ring relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={`View series: ${m.title}`}
                  >
                    <div className="media-zoom relative aspect-[2/3] w-full">
                      <CoverImage src={m.cover_image} seed={m._id} ratio="portrait" alt="" />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <span className="inline-flex rounded-full border border-amber-400/40 bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-amber-200">
                          ◆ Rank {m.rank}
                        </span>
                        <h3 className="font-display mt-2 line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors group-hover:text-violet-bright">
                          {m.title}
                        </h3>
                        <p className="truncate text-[11px] text-white/70">{m.author}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ============ Ritual ============ */}
        <section id="ritual" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="ritual-heading">
          <div className="max-w-2xl">
            <p className="kicker">The reader's ritual</p>
            <h2 id="ritual-heading" className="font-display mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Three vows, one codex
            </h2>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="panel relative p-6">
                <span aria-hidden="true" className="font-display text-gradient-gold text-4xl font-bold">
                  {s.n}
                </span>
                <h3 className="font-display mt-3 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ============ Final CTA ============ */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-10 lg:pb-28" aria-labelledby="cta-heading">
          <div className="panel relative overflow-hidden px-6 py-14 text-center sm:px-10 lg:py-20">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/12 blur-[100px]" />
              <div className="absolute bottom-[-40%] left-[-10%] size-[24rem] rounded-full bg-amber-400/8 blur-[100px]" />
            </div>
            <div className="relative flex flex-col items-center gap-5">
              <span className="flex size-14 items-center justify-center rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-400/15 to-fuchsia-400/5 shadow-[0_0_30px_-8px_var(--violet-glow)]">
                <CodexSigil className="size-8" />
              </span>
              <h2 id="cta-heading" className="font-display max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                The archive remembers <span className="text-gradient-gold">those who write</span>
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-text-2 sm:text-base">
                Sign in with email or continue as a guest — the codex opens the moment you do.
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
                <Link to="/auth?returnTo=%2Fdashboard" className="btn-arcane px-7 py-3 text-base">
                  <Trophy className="size-4" aria-hidden="true" /> Enter the Codex
                </Link>
                <Link
                  to="/auth?returnTo=%2Fcharacters"
                  className="btn-gold px-7 py-3 text-base"
                >
                  <Users className="size-4" aria-hidden="true" /> Meet the heroes
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============ Footer ============ */}
      <footer className="border-t border-border/70 py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 text-xs text-muted-foreground sm:px-6 lg:px-10">
          <p className="flex items-center gap-2">
            <CodexSigil className="size-4" />
            Manhwa Codex — a living archive kept by its readers.
          </p>
          <p>
            Press{" "}
            <kbd className="rounded border border-border bg-card-elev px-1 py-0.5 font-mono text-[10px]">Ctrl</kbd>{" "}
            +{" "}
            <kbd className="rounded border border-border bg-card-elev px-1 py-0.5 font-mono text-[10px]">K</kbd>{" "}
            inside to search the archive.
          </p>
        </div>
      </footer>
    </div>
  );
}
