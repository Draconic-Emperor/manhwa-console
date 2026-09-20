import type { ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

/* ---------- Badge / pill with semantic tone ---------- */

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "gold" | "crimson" | "ember" | "moss" | "warning" | "danger";
}) {
  const tones: Record<string, string> = {
    neutral: "border-white/10 bg-white/5 text-text-2",
    gold: "border-gold/35 bg-gold/12 text-gold",
    crimson: "border-crimson/50 bg-crimson/15 text-[#e59aa3]",
    ember: "border-crimson/60 bg-crimson/20 text-[#f2b8bb]",
    moss: "border-[#7d9c6a]/40 bg-[#7d9c6a]/12 text-[#a9c494]",
    warning: "border-gold/45 bg-gold/15 text-[#e8c96a]",
    danger: "border-[#e5484d]/40 bg-[#e5484d]/12 text-[#f2b8bb]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Rank medallion: number + tier label (never color alone) ---------- */

export function RankBadge({ rank, className }: { rank: number; className?: string }) {
  const tier =
    rank <= 10
      ? { label: "Mythic", cls: "border-gold/55 bg-gold/15 text-[#f0dd9a]", ring: "shadow-[0_0_14px_-2px_var(--gold-glow)]" }
      : rank <= 25
        ? { label: "Legendary", cls: "border-crimson/60 bg-crimson/18 text-[#eda3ac]", ring: "shadow-[0_0_14px_-4px_var(--crimson-glow)]" }
        : rank <= 50
          ? { label: "Elite", cls: "border-gold/35 bg-gold/10 text-gold", ring: "" }
          : { label: "Rising", cls: "border-white/15 bg-white/5 text-text-2", ring: "" };

  return (
    <span
      title={`Rank ${rank} — ${tier.label} tier`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums",
        tier.cls,
        tier.ring,
        className,
      )}
    >
      <span aria-hidden="true">◆</span>
      Rank {rank}
      <span className="sr-only"> — {tier.label} tier</span>
      <span aria-hidden="true" className="font-medium opacity-80">
        · {tier.label}
      </span>
    </span>
  );
}

/* ---------- Record status pill for series ---------- */

export function StatusPill({ status }: { status: "ongoing" | "completed" | "hiatus" }) {
  const map = {
    ongoing: { label: "Active Record", tone: "crimson" as const },
    completed: { label: "Sealed Record", tone: "moss" as const },
    hiatus: { label: "Dormant Record", tone: "warning" as const },
  };
  const s = map[status] ?? map.ongoing;
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

/* ---------- Section header (kicker + title + optional action) ---------- */

export function SectionHeader({
  kicker,
  title,
  action,
  className,
}: {
  kicker?: string;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 flex flex-wrap items-end justify-between gap-3", className)}>
      <div>
        {kicker && <p className="kicker">{kicker}</p>}
        <h2 className="font-display mt-1.5 text-xl font-semibold tracking-tight text-parchment sm:text-2xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

/* ---------- Empty state ---------- */

export function EmptyState({
  icon,
  title,
  hint,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "panel flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-2xl border border-gold/30 bg-crimson/10 text-gold shadow-[0_0_30px_-8px_var(--crimson-glow)]"
      >
        {icon}
      </div>
      <p className="font-display text-lg font-semibold text-parchment">{title}</p>
      {hint && <p className="max-w-sm text-sm leading-relaxed text-text-2">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/* ---------- Skeleton grids ---------- */

export function SkeletonGrid({
  count = 8,
  kind = "manhwa",
}: {
  count?: number;
  kind?: "manhwa" | "character" | "insight";
}) {
  if (kind === "character") {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="panel overflow-hidden" aria-hidden="true">
            <div className="skeleton aspect-[3/4] w-full rounded-b-none" />
            <div className="space-y-2 p-3">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (kind === "insight") {
    return (
      <div className="space-y-4" aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="panel space-y-3 p-5">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-5 w-2/3" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-4/5" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="panel overflow-hidden" aria-hidden="true">
          <div className="skeleton aspect-[2/3] w-full rounded-b-none" />
          <div className="space-y-2 p-3">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Named link helpers (keep card markup clean) ---------- */

export function LinkCard({
  to,
  className,
  children,
  label,
}: {
  to: string;
  className?: string;
  children: ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={cn(
        "group record hover-lift focus-visible:ring-ring relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {children}
    </Link>
  );
}
