"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, Film, TvIcon, Settings } from "lucide-react";
import { TooltipElement } from "@/components/TooltipElement";

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-xl border-b border-border/40">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 py-4 sm:h-20">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-black tracking-tight hover:text-foreground/80 transition-colors duration-300 shrink-0"
          >
            vogon
          </Link>
          <div className="flex flex-wrap gap-2">
            <TooltipElement content="Movies">
                <Link
                  href="/movie"
                  className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ease-out ${
                    isActive("/movie")
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "hover:bg-muted/50 text-foreground/70 hover:text-foreground"
                  }`}
                >
                  <Film className="h-4 w-4" />
                  <span className="hidden lg:inline">Movies</span>
                </Link>
              </TooltipElement>
            <TooltipElement content="Shows">
                <Link
              href="/show"
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ease-out ${
                isActive("/show")
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "hover:bg-muted/50 text-foreground/70 hover:text-foreground"
              }`}
            >
              <TvIcon className="h-4 w-4" />
              <span className="hidden lg:inline">Shows</span>
            </Link>
            </TooltipElement>
            <TooltipElement content="Import Library">
              <Link
              href="/import"
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ease-out ${
                isActive("/import")
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "hover:bg-muted/50 text-foreground/70 hover:text-foreground"
              }`}
            >
              <Library className="h-4 w-4" />
              <span className="hidden lg:inline">Import Library</span>
            </Link>
            </TooltipElement>
            <TooltipElement content="Config">
            <Link
              href="/config"
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ease-out ${
                isActive("/config")
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "hover:bg-muted/50 text-foreground/70 hover:text-foreground"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden lg:inline">Config</span>
            </Link>
            </TooltipElement>
          </div>
        </div>
      </div>
    </nav>
  );
}
