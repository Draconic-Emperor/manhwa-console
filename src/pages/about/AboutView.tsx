import { BookOpen, KeyRound, FolderHeart, ScrollText, Sparkles, Trophy, Users } from "lucide-react";
import { ConsoleSeal } from "@/components/layout/BrandMark";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Series archive",
    text: "Every manhwa inscribed by the researchers — browsable, filterable, and linked to its full cast of entities.",
  },
  {
    icon: Users,
    title: "Entity registry",
    text: "Catalog heroes, villains, and supporting souls with portraits, designations, and power ranks.",
  },
  {
    icon: Trophy,
    title: "Rankings",
    text: "A community-maintained ladder grouped into Mythic, Legendary, Elite, and Rising tiers.",
  },
  {
    icon: ScrollText,
    title: "Chronicles",
    text: "Seal lore breakdowns, reviews, and fan theories onto any entity's record for future researchers.",
  },
  {
    icon: FolderHeart,
    title: "Collections",
    text: "Seal records and entities into a personal vault of the archive with a single touch.",
  },
  {
    icon: Sparkles,
    title: "Conjured artwork",
    text: "Missing cover art? The console conjures deterministic arcane art for every entry.",
  },
];

export default function AboutView() {
  return (
    <div className="space-y-10">
      <header className="rise-in">
        <p className="kicker">About the console</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-parchment sm:text-4xl">
          A forbidden archive, <span className="text-gradient-ember">kept by its researchers</span>
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-2 sm:text-base">
          Manhwa Console is a community-driven repository for manhwa series, entities, lore,
          rankings, chronicles, and collections. There is no editorial gate: every record is
          inscribed by researchers who love these worlds and want the knowledge kept — organized,
          ranked, and preserved.
        </p>
      </header>

      <section aria-label="The console seal" className="record relative overflow-hidden p-8 sm:p-10">
        <div aria-hidden="true" className="absolute -right-16 -top-16 size-64 rounded-full bg-crimson/15 blur-3xl" />
        <div className="relative flex flex-col items-center gap-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl border border-gold/35 bg-void shadow-[0_0_30px_-8px_var(--crimson-glow)]">
            <ConsoleSeal className="size-9" />
          </span>
          <h2 className="font-display text-2xl font-bold text-parchment">The seal's meaning</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-text-2">
            The stylized M stands for the archive itself — two pillars of records joined by a single
            apex of knowledge. The gold ring marks a researcher's oath to keep what they find; the
            crimson line beneath marks the forbidden knowledge sealed within. Written down is
            knowledge that survives.
          </p>
        </div>
      </section>

      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="font-display mb-5 text-xl font-semibold text-parchment sm:text-2xl">
          What lies within
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <article key={f.title} className="record hover-lift p-5">
                <span className="flex size-10 items-center justify-center rounded-xl border border-gold/30 bg-crimson/12 text-gold">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="font-display mt-4 text-base font-semibold text-parchment">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-2">{f.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="principles-heading" className="record p-6 sm:p-8">
        <h2 id="principles-heading" className="font-display text-xl font-semibold text-parchment sm:text-2xl">
          The researcher's oaths
        </h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-text-2">
          <li className="flex gap-3">
            <span aria-hidden="true" className="font-display font-bold text-gold">I.</span>
            Record faithfully — an archive is only as strong as its accuracy.
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="font-display font-bold text-gold">II.</span>
            Rank with respect — the ladder reflects community standing, not gatekeeping.
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="font-display font-bold text-gold">III.</span>
            Share generously — chronicles are meant to be read, debated, and built upon.
          </li>
        </ol>
      </section>

      <section className="flex flex-wrap items-center justify-center gap-3">
        <a href="/series" className="btn-gold px-5 py-2.5 text-sm">
          <BookOpen className="size-4" aria-hidden="true" /> Browse the records
        </a>
        <a href="/rankings" className="btn-ember px-5 py-2.5 text-sm">
          <Trophy className="size-4" aria-hidden="true" /> See the rankings
        </a>
        <a href="/chronicles" className="btn-ember px-5 py-2.5 text-sm">
          <KeyRound className="size-4" aria-hidden="true" /> Read the chronicles
        </a>
      </section>
    </div>
  );
}
