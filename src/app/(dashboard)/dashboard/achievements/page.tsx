"use client";

import CrudSectionPage from "@/components/dashboard/CrudSectionPage";
import type { FieldConfig } from "@/components/dashboard/SectionEditor";

const fields: FieldConfig[] = [
  { key: "title", label: "Title", placeholder: "Top Graduate Award" },
  { key: "organization", label: "Organization", placeholder: "University Name", required: false },
  { key: "date", label: "Date", type: "date", required: false },
  { key: "certificate_url", label: "Certificate URL", type: "url", placeholder: "https://...", required: false },
  { key: "order_index", label: "Order Index", type: "number", placeholder: "100", required: false },
  { key: "description", label: "Description", type: "textarea", placeholder: "Describe the achievement and impact.", required: false },
];

export default function AchievementsDashboardPage() {
  return (
    <CrudSectionPage<Record<string, any>>
      title="Achievements"
      description="Manage recognitions, awards, and milestone records."
      endpoint="/api/achievements"
      fields={fields}
    />
  );
}