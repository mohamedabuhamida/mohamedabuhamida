"use client";

import CrudSectionPage from "@/components/dashboard/CrudSectionPage";
import type { FieldConfig } from "@/components/dashboard/SectionEditor";

const fields: FieldConfig[] = [
  { key: "title", label: "Title", placeholder: "Google UX Design", required: true },
  { key: "organization", label: "Organization", placeholder: "Google", required: true },
  { key: "issue_date", label: "Issue Date", type: "date", required: false },
  { key: "expiration_date", label: "Expiration Date", type: "date", required: false },
  { key: "credential_id", label: "Credential ID", placeholder: "ABC-123", required: false },
  { key: "credential_url", label: "Credential URL", type: "url", placeholder: "https://...", required: false },
  { key: "order_index", label: "Order Index", type: "number", placeholder: "100", required: false },
  { key: "description", label: "Description", type: "textarea", placeholder: "Certification details and summary.", required: false },
];

export default function CertificatesDashboardPage() {
  return (
    <CrudSectionPage<Record<string, any>>
      title="Certificates"
      description="Manage certificate details, links, and dates."
      endpoint="/api/certificates"
      fields={fields}
    />
  );
}