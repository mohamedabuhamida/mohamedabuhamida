"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Overview", href: "/dashboard" },
    { name: "Hero", href: "/dashboard/hero" },
    { name: "Skills", href: "/dashboard/skills" },
    { name: "Experience", href: "/dashboard/experience" },
    { name: "Education", href: "/dashboard/education" },
    { name: "Certificates", href: "/dashboard/certificates" },
    { name: "Achievements", href: "/dashboard/achievements" },
    { name: "Projects", href: "/dashboard/projects" },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/auth/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <aside className="w-64 border-r border-white/10 p-6 space-y-4">
        <h1 className="text-xl font-bold text-accent mb-8">Portfolio CMS</h1>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive ? "bg-accent text-bg font-bold" : "hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="pt-8">
          <Link href="/" className="text-sm text-text/40 hover:text-white">
            View Site
          </Link>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full text-left text-sm text-red-300 hover:text-red-200 pt-2"
        >
          Sign Out
        </button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
