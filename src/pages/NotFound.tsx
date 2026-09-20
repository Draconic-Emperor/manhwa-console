import { Link } from "react-router";
import { ArrowLeft, Compass } from "lucide-react";
import { ConsoleSeal } from "@/components/layout/BrandMark";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="console-ambient" aria-hidden="true" />
      <div className="console-fog" aria-hidden="true" />
      <div className="console-particles" aria-hidden="true" />

      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="rise-in w-full max-w-lg text-center">
          <div className="flex justify-center">
            <span className="relative flex size-16 items-center justify-center rounded-2xl border border-amethyst/35 bg-void shadow-[0_0_30px_-8px_var(--crimson-glow)]">
              <ConsoleSeal className="size-9" />
            </span>
          </div>

          <p className="kicker mt-8 justify-center">Record not found</p>
          <h1 className="font-display mt-3 text-7xl font-bold tracking-tight sm:text-8xl">
            <span className="text-gradient-amethyst">404</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-text-2 sm:text-lg">
            This page was lost between the shelves — perhaps struck from the archive, or never
            inscribed at all.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/dashboard" className="btn-amethyst px-5 py-2.5 text-sm">
              <ArrowLeft className="size-4" aria-hidden="true" /> Return to the archive
            </Link>
            <Link to="/series" className="btn-ember px-5 py-2.5 text-sm">
              <Compass className="size-4" aria-hidden="true" /> Browse the records
            </Link>
          </div>
        </div>
      </div>

      <footer className="pb-8 text-center text-xs text-text-3">
        <p>Manhwa Console — Access the Archive. Discover Worlds. Uncover Legends.</p>
      </footer>
    </div>
  );
}
