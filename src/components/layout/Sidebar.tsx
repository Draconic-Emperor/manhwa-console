import { Link, useLocation, useNavigate } from "react-router";
import {
  BookOpen,
  Compass,
  Archive,
  ScrollText,
  Trophy,
  FolderHeart,
  Heart,
  Clock,
  Info,
  LogIn,
  LogOut,
  Search,
  Sparkles,
} from "lucide-react";
import { BrandMark } from "./BrandMark";
import { useAuth } from "@/hooks/use-auth";
import { useCodex } from "@/hooks/use-codex";
import { cn } from "@/lib/utils";

export type NavGroup = {
  label: string;
  items: { to: string; label: string; icon: typeof BookOpen; badge?: number; disabled?: boolean }[];
};

export function useNavGroups(): NavGroup[] {
  const { favorites } = useCodex();
  const favCount = favorites.length;

  const groups: NavGroup[] = [
    {
      label: "Primary",
      items: [
        { to: "/dashboard", label: "Home", icon: Compass },
        { to: "/series", label: "Series", icon: BookOpen },
        { to: "/characters", label: "Characters", icon: UsersIcon },
        { to: "/insights", label: "Insights", icon: ScrollText },
        { to: "/rankings", label: "Rankings", icon: Trophy },
      ],
    },
    {
      label: "Library",
      items: [
        { to: "/collections", label: "Collections", icon: FolderHeart, badge: favCount },
        { to: "/favorites", label: "Favorites", icon: Heart, badge: favCount },
        { to: "/timeline", label: "Timeline", icon: Clock, disabled: true },
      ],
    },
    {
      label: "Secondary",
      items: [{ to: "/about", label: "About Codex", icon: Info }],
    },
  ];
  return groups;
}

function UsersIcon(props: { className?: string }) {
  return <Archive {...props} />;
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, signOut } = useAuth();
  const groups = useNavGroups();
  const { manhwa, characters, insights, loading } = useCodex();

  const openSearch = () => {
    onNavigate?.();
    window.dispatchEvent(new CustomEvent("codex:open-search"));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
        <BrandMark to="/dashboard" />
      </div>

      {/* Search entry */}
      <div className="px-3 pt-4">
        <button
          type="button"
          onClick={openSearch}
          className="group flex w-full items-center gap-2.5 rounded-lg border border-border bg-surface/60 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-violet-400/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="flex-1 truncate text-left">Search the archive…</span>
          <kbd className="hidden rounded border border-border bg-card-elev px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Nav groups */}
      <nav aria-label="Codex sections" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active =
                  !item.disabled &&
                  (location.pathname === item.to || location.pathname.startsWith(item.to + "/"));
                const Icon = item.icon;
                if (item.disabled) {
                  return (
                    <li key={item.to}>
                      <span
                        aria-disabled="true"
                        title="Coming soon"
                        className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/50"
                      >
                        <Icon className="size-4 shrink-0" aria-hidden="true" />
                        <span className="flex-1">{item.label}</span>
                        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-300">
                          Soon
                        </span>
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "bg-violet-400/12 text-foreground"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                      )}
                    >
                      {active && (
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-bright to-magenta shadow-[0_0_10px_var(--violet-glow)]"
                        />
                      )}
                      <Icon
                        className={cn("size-4 shrink-0", active && "text-violet-bright")}
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.badge != null && item.badge > 0 && (
                        <span className="rounded-full bg-violet-400/15 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-violet-bright">
                          {item.badge}
                        </span>
                      )}
                      {item.to === "/insights" && !loading && (
                        <span className="sr-only">{insights.length} entries</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Archive pulse — subtle decorative summary */}
        {!loading && (
          <div className="panel-glass hidden rounded-xl p-4 sm:block" aria-hidden="true">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-bright">
              <Sparkles className="size-3.5" /> Archive pulse
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="font-display text-lg font-bold tabular-nums text-foreground">{manhwa.length}</p>
                <p className="text-[10px] text-muted-foreground">Series</p>
              </div>
              <div>
                <p className="font-display text-lg font-bold tabular-nums text-foreground">{characters.length}</p>
                <p className="text-[10px] text-muted-foreground">Heroes</p>
              </div>
              <div>
                <p className="font-display text-lg font-bold tabular-nums text-foreground">{insights.length}</p>
                <p className="text-[10px] text-muted-foreground">Insights</p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth area */}
      <div className="shrink-0 border-t border-border p-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-violet-400/30 bg-violet-400/12 font-display text-sm font-bold text-violet-bright"
            >
              {(user?.name ?? user?.email ?? "R")[0]?.toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">
                {user?.name ?? "Reader"}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {user?.email ?? "Anonymous scribe"}
              </span>
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              title="Sign out"
              aria-label="Sign out"
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LogOut className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <Link
            to="/auth?returnTo=%2Fdashboard"
            onClick={onNavigate}
            className="btn-arcane w-full px-4 py-2.5 text-sm"
          >
            <LogIn className="size-4" aria-hidden="true" />
            Enter the Codex
          </Link>
        )}
      </div>
    </div>
  );
}
