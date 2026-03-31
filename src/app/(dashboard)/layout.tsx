// src/app/(dashboard)/layout.tsx
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: "Hero", href: "/dashboard/hero" },
    { name: "Skills", href: "/dashboard/skills" },
    { name: "Experience", href: "/dashboard/experience" },
    { name: "Education", href: "/dashboard/education" },
    { name: "Projects", href: "/dashboard/projects" },
    { name: "Achievements", href: "/dashboard/achievements" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 space-y-4">
        <h1 className="text-xl font-bold text-accent mb-8">CMS Dashboard</h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="block px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="pt-8">
            <Link href="/" className="text-sm text-text/40 hover:text-white">← View Site</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}