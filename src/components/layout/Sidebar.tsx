import { Link, useLocation, useNavigate } from "react-router";
import {
  BookOpen,
  Compass,
  Users,
  ScrollText,
  Trophy,
  FolderHeart,
  Heart,
  Info,
  LogIn,
  LogOut,
  Search,
  KeyRound,
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
      label: "Records",
      items: [
        { to: "/dashboard", label: "Archive", icon: Compass },
        { to: "/series", label: "Series", icon: BookOpen },
        { to: "/characters", label: "Entities", icon: Users },
        { to: "/chronicles", label: "Chronicles", icon: ScrollText },
        { to: "/rankings", label: "Rankings", icon: Trophy },
      ],
    },
    {
      label: "Vault",
      items: [
        { to: "/collections", label: "Collections", icon: FolderHeart, badge: favCount },
        { to: "/favorites", label: "Saved Records", icon: Heart, badge: favCount },
      ],
    },
    {
      label: "Console",
      items: [{ to: "/about", label: "About the Console", icon: Info }],
    },
  ];
  return groups;
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

      {/* Query Archive entry */}
      <div className="px-3 pt-4">
        <button
          type="button"
          onClick={openSearch}
          className="group flex w-full items-center gap-2.5 rounded-lg border border-gold/25 bg-void/70 px-3 py-2.5 text-sm text-muted-foreground transition-all hover:border-gold/50 hover:text-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="flex-1 truncate text-left">Query Archive…</span>
          <kbd className="hidden rounded border border-border bg-panel px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Nav groups */}
      <nav aria-label="Console sections" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-text-3">
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
                        title="Sealed — coming soon"
                        className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-3/70"
                      >
                        <Icon className="size-4 shrink-0" aria-hidden="true" />
                        <span className="flex-1">{item.label}</span>
                        <span className="rounded-full border border-gold/30 bg-gold/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gold">
                          Sealed
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
                          ? "bg-crimson/15 text-parchment"
                          : "text-text-2 hover:bg-white/[0.04] hover:text-parchment",
                      )}
                    >
                      {active && (
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-antique-gold to-crimson shadow-[0_0_10px_var(--crimson-glow)]"
                        />
                      )}
                      <Icon
                        className={cn("size-4 shrink-0", active ? "text-antique-gold" : "text-text-3 group-hover:text-gold")}
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.badge != null && item.badge > 0 && (
                        <span className="rounded-full bg-gold/15 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-gold">
                          {item.badge}
                        </span>
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
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              <KeyRound className="size-3.5" /> Archive Index
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="font-display text-lg font-bold tabular-nums text-parchment">{manhwa.length}</p>
                <p className="text-[10px] text-text-3">Records</p>
              </div>
              <div>
                <p className="font-display text-lg font-bold tabular-nums text-parchment">{characters.length}</p>
                <p className="text-[10px] text-text-3">Entities</p>
              </div>
              <div>
                <p className="font-display text-lg font-bold tabular-nums text-parchment">{insights.length}</p>
                <p className="text-[10px] text-text-3">Chronicles</p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Researcher area */}
      <div className="shrink-0 border-t border-border p-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-crimson/20 font-display text-sm font-bold text-gold"
            >
              {(user?.name ?? user?.email ?? "R")[0]?.toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-parchment">
                {user?.name ?? "Researcher"}
              </span>
              <span className="block truncate text-xs text-text-3">
                {user?.email ?? "Anonymous researcher"}
              </span>
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              title="Leave the archive"
              aria-label="Sign out"
              className="rounded-md p-2 text-text-3 transition-colors hover:bg-white/5 hover:text-[#f2b8bb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LogOut className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <Link
            to="/auth?returnTo=%2Fdashboard"
            onClick={onNavigate}
            className="btn-gold w-full px-4 py-2.5 text-sm"
          >
            <LogIn className="size-4" aria-hidden="true" />
            Enter the Archive
          </Link>
        )}
      </div>
    </div>
  );
}
