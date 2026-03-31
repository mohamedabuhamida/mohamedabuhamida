"use client";

import CrudSectionPage from "@/components/dashboard/CrudSectionPage";
import type { FieldConfig } from "@/components/dashboard/SectionEditor";

const fields: FieldConfig[] = [
  { key: "degree", label: "Degree", placeholder: "B.Sc. Computer Science", required: true },
  { key: "field_of_study", label: "Field of Study", placeholder: "Artificial Intelligence", required: false },
  { key: "institution", label: "Institution", placeholder: "University Name", required: true },
  { key: "location", label: "Location", placeholder: "Cairo, Egypt", required: false },
  { key: "start_date", label: "Start Date", type: "date", required: false },
  { key: "end_date", label: "End Date", type: "date", required: false },
  { key: "grade", label: "Grade", placeholder: "Excellent", required: false },
  { key: "order_index", label: "Order Index", type: "number", placeholder: "100", required: false },
  { key: "description", label: "Description", type: "textarea", placeholder: "Highlights, projects, and achievements.", required: false },
];

export default function EducationDashboardPage() {
  return (
    <CrudSectionPage<Record<string, any>>
      title="Education"
      description="Manage your education records and timeline."
      endpoint="/api/education"
      fields={fields}
    />
  );
}