import { Link } from "react-router";
import { ArrowLeft, Compass } from "lucide-react";
import { CodexSigil } from "@/components/layout/BrandMark";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="codex-ambient" aria-hidden="true" />

      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="rise-in w-full max-w-lg text-center">
          <div className="flex justify-center">
            <span className="relative flex size-16 items-center justify-center rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-400/15 to-fuchsia-400/5 shadow-[0_0_30px_-8px_var(--violet-glow)]">
              <CodexSigil className="size-9" />
            </span>
          </div>

          <p className="kicker mt-8 justify-center">Page not found</p>
          <h1 className="font-display mt-3 text-7xl font-bold tracking-tight sm:text-8xl">
            <span className="text-gradient-arcane">404</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-text-2 sm:text-lg">
            This page was lost between the pages of the codex — perhaps struck from the archive, or
            never inscribed at all.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/dashboard" className="btn-arcane px-5 py-2.5 text-sm">
              <ArrowLeft className="size-4" aria-hidden="true" /> Return home
            </Link>
            <Link
              to="/series"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-violet-400/40 hover:text-violet-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Compass className="size-4" aria-hidden="true" /> Browse the archive
            </Link>
          </div>
        </div>
      </div>

      <footer className="pb-8 text-center text-xs text-muted-foreground">
        <p>Manhwa Codex — a living archive kept by its readers.</p>
      </footer>
    </div>
  );
}
