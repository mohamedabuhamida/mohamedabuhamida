"use client";

import CrudSectionPage from "@/components/dashboard/CrudSectionPage";
import type { FieldConfig } from "@/components/dashboard/SectionEditor";

const fields: FieldConfig[] = [
  { key: "name", label: "Skill Name", placeholder: "React", required: true },
  { key: "percentage", label: "Percentage", type: "number", placeholder: "90", required: true },
  { key: "category_id", label: "Category ID", type: "number", placeholder: "1", required: false },
  { key: "order_index", label: "Order Index", type: "number", placeholder: "100", required: false },
];

export default function SkillsDashboardPage() {
  return (
    <CrudSectionPage<Record<string, any>>
      title="Skills"
      description="Manage your technical skills and percentages."
      endpoint="/api/skills"
      fields={fields}
    />
  );
}