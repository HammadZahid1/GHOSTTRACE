"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Network, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { NAV_GROUPS } from "@/config/navigation";
import { useUIStore } from "@/stores/ui-store";

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const mobileOpen = useUIStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);

  const content = (
    <nav
      aria-label="Workspace navigation"
      className={cn(
        "flex h-full flex-col bg-bg-secondary/95 backdrop-blur transition-all duration-200",
        collapsed ? "w-[68px]" : "w-60",
      )}
    >
      {/* brand */}
      <div className="flex h-14 items-center gap-2.5 border-b border-panel-border/70 px-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10">
          <Network className="h-4 w-4 text-cyan" />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold tracking-wide text-text-primary">
              GHOST<span className="text-cyan">TRACE</span>
            </p>
            <p className="gt-label leading-none">v0.1</p>
          </div>
        )}
      </div>

      {/* groups */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4">
        {NAV_GROUPS.map((g) => (
          <div key={g.group} className="mb-5">
            {!collapsed && <p className="gt-label mb-1.5 px-2">{g.group}</p>}
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-2.5 py-2 text-[0.8125rem] transition-colors",
                        active
                          ? "bg-cyan/10 text-cyan"
                          : "text-text-secondary hover:bg-panel-elevated hover:text-text-primary",
                        collapsed && "justify-center px-0",
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon
                        className={cn("h-4 w-4 shrink-0", active && "text-cyan")}
                        aria-hidden
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {active && !collapsed && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* workspace identity */}
      <div className="border-t border-panel-border/70 p-3">
        <div
          className={cn(
            "rounded-lg border border-panel-border bg-panel p-2.5",
            collapsed && "flex justify-center",
          )}
        >
          {!collapsed ? (
            <>
              <p className="gt-label">Local workspace</p>
              <p className="mt-0.5 truncate font-mono text-[0.65rem] text-text-secondary">
                GHOSTTRACE LOCAL WORKSPACE
              </p>
            </>
          ) : (
            <span className="h-2 w-2 rounded-full bg-success" title="Local workspace active" />
          )}
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* desktop */}
      <aside className="sticky top-0 hidden h-screen shrink-0 border-r border-panel-border/70 lg:block">
        {content}
      </aside>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <button
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-panel-border text-text-secondary hover:text-cyan"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute left-0 top-0 h-full border-r border-panel-border shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}

/** Desktop collapse toggle (shown in top bar). */
export function CollapseButton() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  return (
    <button
      onClick={toggleSidebar}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className="hidden h-8 w-8 items-center justify-center rounded-lg border border-panel-border text-text-muted transition-colors hover:border-cyan/40 hover:text-cyan lg:flex"
    >
      <ChevronLeft
        className={cn("h-4 w-4 transition-transform duration-200", collapsed && "rotate-180")}
      />
    </button>
  );
}
