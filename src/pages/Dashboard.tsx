import { useAuth } from "@/hooks/use-auth";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { GlobalSearch } from "@/components/search/GlobalSearch";

export default function Dashboard({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <AppShell>
      <GlobalSearch />
      <span className="sr-only">Signed in as {user?.name ?? user?.email ?? "reader"}</span>
      {children}
    </AppShell>
  );
}
