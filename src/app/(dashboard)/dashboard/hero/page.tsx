"use client";

import CrudSectionPage from "@/components/dashboard/CrudSectionPage";
import type { FieldConfig } from "@/components/dashboard/SectionEditor";

const heroFields: FieldConfig[] = [
  { key: "title", label: "Title", placeholder: "AI Engineer" },
  { key: "name", label: "Name", placeholder: "Mohamed AbuHamida" },
  { key: "typing_texts", label: "Typing Texts (comma separated)", type: "array", placeholder: "LLM Engineer, RAG Specialist" },
  { key: "years_experience", label: "Years of Experience", type: "number", placeholder: "3" },
  { key: "projects_count", label: "Projects Count", type: "number", placeholder: "12" },
  { key: "is_available", label: "Available for Work", type: "checkbox", required: false },
];

export default function HeroDashboardPage() {
  return (
    <CrudSectionPage<Record<string, any>>
      title="Hero"
      description="Manage your hero intro, counters, and typing text."
      endpoint="/api/hero"
      fields={heroFields}
      singleRecord
      normalizeLoad={(item) => ({
        ...item,
        typing_texts: Array.isArray(item.typing_texts) ? item.typing_texts.join(", ") : item.typing_texts ?? "",
      })}
      serializeSave={(item) => ({
        ...item,
        typing_texts: String(item.typing_texts ?? "")
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      })}
    />
  );
}