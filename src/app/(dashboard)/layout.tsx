"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMoreOpen, setIsMoreOpen] = useState(() => pathname.startsWith("/dashboard/education") || pathname.startsWith("/dashboard/certificates") || pathname.startsWith("/dashboard/achievements") || pathname.startsWith("/dashboard/projects") || pathname.startsWith("/dashboard/blogs") || pathname.startsWith("/dashboard/media") || pathname.startsWith("/dashboard/profile-knowledge"));

  const navItems = [
    { name: "Overview", href: "/dashboard" },
    { name: "Hero", href: "/dashboard/hero" },
    { name: "CV", href: "/dashboard/cv" },
    { name: "Skills", href: "/dashboard/skills" },
    { name: "Experience", href: "/dashboard/experience" },
    { name: "Education", href: "/dashboard/education" },
    { name: "Certificates", href: "/dashboard/certificates" },
    { name: "Achievements", href: "/dashboard/achievements" },
    { name: "Projects", href: "/dashboard/projects" },
    { name: "Blogs", href: "/dashboard/blogs" },
    { name: "Media", href: "/dashboard/media" },
    { name: "AI Knowledge", href: "/dashboard/profile-knowledge" },
  ];
  const primaryNavItems = navItems.slice(0, 5);
  const secondaryNavItems = navItems.slice(5);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/auth/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white lg:pl-64">
      <aside className="border-b border-white/10 bg-slate-950/95 p-6 backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex h-full min-h-0 flex-col">
          <h1 className="mb-8 shrink-0 text-xl font-bold text-accent">Portfolio CMS</h1>

          <nav className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="space-y-2">
            {primaryNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-4 py-2 transition-colors ${
                    isActive ? "bg-accent text-bg font-bold" : "hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            </div>

            <div className="flex min-h-0 flex-1 flex-col pt-2">
              <button
                type="button"
                onClick={() => setIsMoreOpen((current) => !current)}
                className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-left transition-colors hover:bg-white/5"
              >
                <span className="font-medium">More</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isMoreOpen ? "rotate-180" : ""}`} />
              </button>

              {isMoreOpen ? (
                <div className="dashboard-sidebar-scroll mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto border-l border-white/10 pl-3 pr-2">
                  {secondaryNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block rounded-lg px-4 py-2 transition-colors ${
                          isActive ? "bg-accent text-bg font-bold" : "hover:bg-white/5"
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </nav>

          <div className="mt-6 shrink-0 border-t border-white/10 pt-6">
            <Link href="/" className="text-sm text-text/40 hover:text-white">
              View Site
            </Link>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 w-full text-left text-sm text-red-300 hover:text-red-200"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="min-h-screen p-6 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
