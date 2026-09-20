import { Link } from "react-router";
import { ArrowUpRight, Clock3, Quote } from "lucide-react";
import type { Character, Insight, Manhwa } from "@/lib/codex";
import { INSIGHT_CLASS, INSIGHT_LABEL, timeAgo } from "@/lib/codex";
import { cn } from "@/lib/utils";

export function InsightCard({
  insight,
  character,
  manhwa,
}: {
  insight: Insight;
  character?: Character;
  manhwa?: Manhwa;
}) {
  const type = INSIGHT_LABEL[insight.type] ?? "Note";
  const cls = INSIGHT_CLASS[insight.type] ?? "border-white/10 bg-white/5 text-text-2";

  return (
    <article className="record hover-lift group relative p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", cls)}>{type}</span>
        <span className="inline-flex items-center gap-1 text-xs text-text-3">
          <Clock3 className="size-3.5" aria-hidden="true" />
          <time dateTime={new Date(insight.created_at).toISOString()}>{timeAgo(insight.created_at)}</time>
        </span>
      </div>

      <h3 className="font-display mt-3 text-lg font-semibold leading-snug text-parchment">
        {insight.title || "Untitled record"}
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-2">{insight.content}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs">
          <Quote className="size-3.5 text-gold" aria-hidden="true" />
          {character ? (
            <Link
              to={`/character/${character._id}`}
              className="truncate font-medium text-parchment underline-offset-4 hover:text-gold hover:underline"
            >
              {character.name}
            </Link>
          ) : (
            <span className="text-text-3">Unknown entity</span>
          )}
          {manhwa && (
            <>
              <span aria-hidden="true" className="text-text-3">·</span>
              <span className="truncate text-text-3">{manhwa.title}</span>
            </>
          )}
        </div>
        {character && (
          <Link
            to={`/character/${character._id}`}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-gold transition-colors hover:text-[#f0dd9a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`Open the entity record for ${character.name}`}
          >
            Entity record
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}
