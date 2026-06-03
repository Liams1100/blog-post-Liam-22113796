import type { PropsWithChildren } from "react";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";

export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <div className="min-h-screen flex bg-background text-primary">
      <aside className="w-80 border-r border-border bg-surface p-4">
        <LeftMenu />
      </aside>
      <div className="flex-1">
        <TopMenu query={query} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
