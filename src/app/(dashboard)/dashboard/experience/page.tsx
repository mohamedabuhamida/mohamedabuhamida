"use client";

import CrudSectionPage from "@/components/dashboard/CrudSectionPage";
import type { FieldConfig } from "@/components/dashboard/SectionEditor";

const fields: FieldConfig[] = [
  { key: "job_title", label: "Job Title", placeholder: "Senior AI Engineer" },
  { key: "company", label: "Company", placeholder: "Digital Knights" },
  { key: "location", label: "Location", placeholder: "Cairo, Egypt", required: false },
  { key: "employment_type", label: "Employment Type", placeholder: "Full-time", required: false },
  { key: "start_date", label: "Start Date", type: "date", required: false },
  { key: "end_date", label: "End Date", type: "date", required: false },
  { key: "is_current", label: "Current Position", type: "checkbox", required: false },
  { key: "order_index", label: "Order Index", type: "number", placeholder: "100", required: false },
  { key: "description", label: "Description", type: "textarea", placeholder: "Describe your impact and responsibilities.", required: false },
];

export default function ExperienceDashboardPage() {
  return (
    <CrudSectionPage<Record<string, any>>
      title="Experience"
      description="Manage your professional experience timeline."
      endpoint="/api/experience"
      fields={fields}
    />
  );
}