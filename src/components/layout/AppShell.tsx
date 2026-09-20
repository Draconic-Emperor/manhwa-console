import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { Menu, Search, WifiOff, Zap } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "./Sidebar";
import { CodexSigil } from "./BrandMark";
import { useOnline } from "@/hooks/use-online";
import { useEnsureAuth } from "@/hooks/use-codex";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

/** Global keyboard shortcut: Ctrl/Cmd + K opens the command palette. */
export function useSearchShortcut() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("codex:open-search"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

export function OfflineBanner() {
  const online = useOnline();
  if (online) return null;
  return (
    <div
      role="status"
      className="sticky top-0 z-40 flex items-center justify-center gap-2 border-b border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-200 backdrop-blur"
    >
      <WifiOff className="size-4" aria-hidden="true" />
      The archive cannot reach the ethers — showing the last known state.
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const ensureAuth = useEnsureAuth();
  const seed = useMutation(api.seed.seedArchive);

  // Close the drawer on navigation.
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Prevent background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Seed the archive once per session when signed in.
  const trySeed = useCallback(async () => {
    try {
      await ensureAuth();
      const result = await seed({});
      if (result?.seeded) toast.success("The archive awakens — demo lore inscribed.");
    } catch (e) {
      console.warn("Archive seed skipped:", e);
    }
  }, [ensureAuth, seed]);

  useEffect(() => {
    void trySeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useSearchShortcut();

  return (
    <div className="min-h-dvh">
      <div className="codex-ambient" aria-hidden="true" />
      <OfflineBanner />

      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-sidebar/80 backdrop-blur-xl lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-border bg-background/85 px-4 backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          aria-label="Manhwa Codex home"
          className="flex items-center gap-2 rounded-lg px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-8 items-center justify-center rounded-lg border border-violet-400/30 bg-violet-400/10">
            <CodexSigil className="size-5" />
          </span>
          <span className="font-display text-sm font-bold tracking-[0.2em] text-foreground">CODEX</span>
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("codex:open-search"))}
          aria-label="Search the archive"
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Search className="size-5" aria-hidden="true" />
        </button>
      </header>

      {/* Mobile drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-[280px] border-r border-border bg-sidebar p-0 sm:max-w-[280px]">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent onNavigate={() => setDrawerOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div className="lg:pl-64">
        <main id="main" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-10">
          <div className="codex-rule mb-4" aria-hidden="true" />
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <Zap className="size-3.5 text-violet-bright" aria-hidden="true" />
              Manhwa Codex — a living archive kept by its readers.
            </p>
            <p>Press <kbd className="rounded border border-border bg-card-elev px-1 py-0.5 font-mono text-[10px]">Ctrl</kbd> + <kbd className="rounded border border-border bg-card-elev px-1 py-0.5 font-mono text-[10px]">K</kbd> anywhere to search.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
