import { Link } from "react-router";
import { cn } from "@/lib/utils";

export function CodexSigil({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sigil-v" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A78BFA" />
          <stop offset="1" stopColor="#E879F9" />
        </linearGradient>
      </defs>
      <path
        d="M32 10 L34 30 L54 32 L34 34 L32 54 L30 34 L10 32 L30 30 Z"
        fill="url(#sigil-v)"
      />
      <circle cx="32" cy="32" r="5.5" fill="none" stroke="#F5C76B" strokeWidth="2.5" />
    </svg>
  );
}

/** Brand lockup: sigil + MANHWA CODEX wordmark. */
export function BrandMark({ to = "/", compact = false }: { to?: string; compact?: boolean }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label="Manhwa Codex home"
    >
      <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-400/15 to-fuchsia-400/5 shadow-[0_0_18px_-4px_var(--violet-glow)] transition-transform duration-300 group-hover:rotate-6">
        <CodexSigil className="size-6" />
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="font-display block truncate text-[15px] font-bold leading-tight tracking-[0.18em] text-foreground">
            MANHWA
          </span>
          <span className="text-gradient-gold font-display block text-[11px] font-semibold leading-tight tracking-[0.42em]">
            CODEX
          </span>
        </span>
      )}
    </Link>
  );
}
