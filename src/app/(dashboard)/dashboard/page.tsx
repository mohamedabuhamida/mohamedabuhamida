import Link from "next/link";

const sections = [
  { title: "Hero", href: "/dashboard/hero", desc: "Edit intro content and key stats." },
  { title: "Skills", href: "/dashboard/skills", desc: "Manage skill names and levels." },
  { title: "Experience", href: "/dashboard/experience", desc: "Maintain work journey entries." },
  { title: "Education", href: "/dashboard/education", desc: "Keep education details up to date." },
  { title: "Certificates", href: "/dashboard/certificates", desc: "Add certificates and credentials." },
  { title: "Achievements", href: "/dashboard/achievements", desc: "Track milestones and recognitions." },
  { title: "Projects", href: "/dashboard/projects", desc: "Showcase portfolio projects." },
];

export default function DashboardOverviewPage() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
        <p className="text-text/50 mt-2">Choose a section to manage your portfolio data.</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
          >
            <h3 className="text-lg font-bold">{section.title}</h3>
            <p className="text-sm text-text/50 mt-1">{section.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}