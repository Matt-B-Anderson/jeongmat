"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, PlusCircle, HelpCircle, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/batches/new",
    label: "New Batch",
    icon: PlusCircle,
  },
  {
    href: "/troubleshoot",
    label: "Troubleshoot",
    icon: HelpCircle,
  },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 flex-shrink-0"
          >
            <span className="text-xl font-bold text-primary">정맛</span>
            <span className="text-xs text-text-muted hidden sm:block font-medium tracking-wide">
              Jeong Mat
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  pathname === href || pathname.startsWith(href + "/")
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:text-text hover:bg-border-light"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                variables: { colorPrimary: "#1B4332" },
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-1.5 text-text-muted hover:text-text rounded-md"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-bg-card">
          <nav className="flex flex-col p-2 gap-0.5">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  pathname === href || pathname.startsWith(href + "/")
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:text-text hover:bg-border-light"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
