"use client";

import CrudSectionPage from "@/components/dashboard/CrudSectionPage";
import type { FieldConfig } from "@/components/dashboard/SectionEditor";

const fields: FieldConfig[] = [
  { key: "id", label: "Project ID", placeholder: "project-unique-id", required: false },
  { key: "title", label: "Title", placeholder: "Portfolio Website", required: true },
  { key: "tagline", label: "Tagline", placeholder: "Cinematic subtitle", required: false },
  { key: "section", label: "Sections", type: "array", placeholder: "AI, Web, Full-stack", required: false },
  { key: "technologies", label: "Technologies", type: "array", placeholder: "Next.js, Supabase, TypeScript", required: false },
  { key: "features", label: "Features", type: "array", placeholder: "Auth, Dashboard, Uploads", required: false },
  { key: "background_type", label: "Background Type", placeholder: "image or video", required: false },
  { key: "accent_color", label: "Accent Color", placeholder: "#4EA8DE", required: false },
  { key: "is_featured", label: "Featured", type: "checkbox", required: false },
  { key: "love", label: "Love Count", type: "number", placeholder: "0", required: false },
  { key: "link", label: "Project Link", type: "url", placeholder: "https://...", required: true },
  { key: "image", label: "Card Image", type: "image", required: false },
  { key: "hero_image", label: "Hero Image", type: "image", required: false },
  { key: "description", label: "Description", type: "textarea", placeholder: "Short project description.", required: true },
  { key: "details", label: "Details", type: "textarea", placeholder: "Extended project details.", required: true },
];

export default function ProjectsDashboardPage() {
  return (
    <CrudSectionPage<Record<string, any>>
      title="Projects"
      description="Manage full project metadata including images, arrays, and links."
      endpoint="/api/projects"
      fields={fields}
    />
  );
}