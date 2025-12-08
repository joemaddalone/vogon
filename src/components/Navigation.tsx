"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, Film, TvIcon, Settings } from "lucide-react";
import { TooltipElement } from "@/components/TooltipElement";
import { ServerSelector } from "@/components/ServerSelect";
import { Session, Selectable } from "@/lib/types";
import { Server } from "@/lib/types";
import { useTranslations } from "next-intl";
export function Navigation({
  session,
  servers,
}: {
  session?: Selectable<Session>;
  servers?: Selectable<Server>[];
}) {
  const pathname = usePathname();
  const t = useTranslations();
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-xl border-b border-border/40">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 py-4 sm:h-20">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-black tracking-tight hover:text-foreground/80 transition-colors duration-300 shrink-0 mr-2"
            >
              V
            </Link>
            {session && servers && (
              <ServerSelector session={session} servers={servers} />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <TooltipElement content={t("navigation.movies")}>
              <Link
                data-testid="navigation-movies"
                href="/movie"
                className={`navbar-link-item ${
                  isActive("/movie")
                    ? "active"
                    : "inactive"
                }`}
              >
                <Film className="h-4 w-4" />
                <span className="hidden lg:inline">{t("navigation.movies")}</span>
              </Link>
            </TooltipElement>
            <TooltipElement content={t("navigation.shows")}>
              <Link
                data-testid="navigation-shows"
                href="/show"
                className={`navbar-link-item ${
                  isActive("/show")
                    ? "active"
                    : "inactive"
                }`}
              >
                <TvIcon className="h-4 w-4" />
                <span className="hidden lg:inline">{t("navigation.shows")}</span>
              </Link>
            </TooltipElement>
            <TooltipElement content={t("navigation.importLibrary")}>
              <Link
                data-testid="navigation-import"
                href="/import"
                className={`navbar-link-item ${
                  isActive("/import")
                    ? "active"
                    : "inactive"
                }`}
              >
                <Library className="h-4 w-4" />
                <span className="hidden lg:inline">{t("navigation.importLibrary")}</span>
              </Link>
            </TooltipElement>
            <TooltipElement content={t("navigation.config")}>
              <Link
                data-testid="navigation-config"
                href="/config"
                className={`navbar-link-item ${
                  isActive("/config")
                    ? "active"
                    : "inactive"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span className="hidden lg:inline">{t("navigation.config")}</span>
              </Link>
            </TooltipElement>
          </div>
        </div>
      </div>
    </nav>
  );
}
