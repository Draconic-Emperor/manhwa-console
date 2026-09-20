import { BookOpen, Compass, FolderHeart, Heart, ScrollText, Sparkles, Trophy, Users } from "lucide-react";
import { CodexSigil } from "@/components/layout/BrandMark";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Series archive",
    text: "Every manhwa inscribed by the community — browsable, filterable, and linked to its full cast.",
  },
  {
    icon: Users,
    title: "Character registry",
    text: "Catalog heroes, villains, and supporting souls with portraits, roles, and power ranks.",
  },
  {
    icon: Trophy,
    title: "Power rankings",
    text: "A community-maintained ladder grouped into Mythic, Legendary, Elite, and Rising tiers.",
  },
  {
    icon: ScrollText,
    title: "Insights & theories",
    text: "Share lore breakdowns, reviews, and fan theories on any character's page.",
  },
  {
    icon: FolderHeart,
    title: "Collections",
    text: "Save series and characters to a personal wing of the archive with a single tap.",
  },
  {
    icon: Sparkles,
    title: "Arcane fallbacks",
    text: "Missing cover art? The codex conjures deterministic constellation art for every entry.",
  },
];

export default function AboutView() {
  return (
    <div className="space-y-10">
      <header className="rise-in">
        <p className="kicker">About the codex</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          A living archive, <span className="text-gradient-arcane">kept by its readers</span>
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-2 sm:text-base">
          Manhwa Codex is a community-driven archive for manhwa series, characters, lore, rankings,
          insights, and collections. There is no editorial gate: every entry is inscribed by readers
          who love these worlds and want the knowledge kept — organized, ranked, and shared.
        </p>
      </header>

      <section aria-label="Codex sigil" className="panel relative overflow-hidden p-8 sm:p-10">
        <div aria-hidden="true" className="absolute -right-16 -top-16 size-64 rounded-full bg-violet-400/10 blur-3xl" />
        <div className="relative flex flex-col items-center gap-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-400/15 to-fuchsia-400/5 shadow-[0_0_30px_-8px_var(--violet-glow)]">
            <CodexSigil className="size-9" />
          </span>
          <h2 className="font-display text-2xl font-bold text-foreground">The sigil's meaning</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-text-2">
            The four-pointed star marks a page of the codex; the gold ring marks a reader's oath to
            keep it. Together they stand for the pact at the heart of this archive — knowledge
            written down is knowledge that survives.
          </p>
        </div>
      </section>

      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="font-display mb-5 text-xl font-semibold sm:text-2xl">
          What lives inside
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <article key={f.title} className="panel hover-lift p-5">
                <span className="flex size-10 items-center justify-center rounded-xl border border-violet-400/25 bg-violet-400/10 text-violet-bright">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="font-display mt-4 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="principles-heading" className="panel p-6 sm:p-8">
        <h2 id="principles-heading" className="font-display text-xl font-semibold sm:text-2xl">
          House rules
        </h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-text-2">
          <li className="flex gap-3">
            <span aria-hidden="true" className="font-display font-bold text-violet-bright">I.</span>
            Record faithfully — a codex is only as strong as its accuracy.
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="font-display font-bold text-violet-bright">II.</span>
            Rank with respect — the ladder reflects community standing, not gatekeeping.
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="font-display font-bold text-violet-bright">III.</span>
            Share generously — insights are meant to be read, debated, and built upon.
          </li>
        </ol>
      </section>

      <section className="flex flex-wrap items-center justify-center gap-3">
        <a href="/series" className="btn-arcane px-5 py-2.5 text-sm">
          <BookOpen className="size-4" aria-hidden="true" /> Browse the archive
        </a>
        <a href="/rankings" className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-gold/40 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Trophy className="size-4" aria-hidden="true" /> See the rankings
        </a>
      </section>
    </div>
  );
}
