"use client";

import { useCallback, useEffect, useState } from "react";
import SectionEditor, { FieldConfig } from "@/components/dashboard/SectionEditor";

interface CrudSectionPageProps<T extends Record<string, any>> {
  title: string;
  description: string;
  endpoint: string;
  fields: FieldConfig[];
  singleRecord?: boolean;
  normalizeLoad?: (item: any) => T;
  serializeSave?: (item: T) => Record<string, any>;
}

export default function CrudSectionPage<T extends Record<string, any>>({
  title,
  description,
  endpoint,
  fields,
  singleRecord = false,
  normalizeLoad,
  serializeSave,
}: CrudSectionPageProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      const raw = await res.json();
      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
      setData(normalizeLoad ? list.map(normalizeLoad) : list);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, normalizeLoad]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (item: T) => {
    const payload = serializeSave ? serializeSave(item) : item;
    const method = item.id ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorPayload = await res.json().catch(() => null);
      throw new Error(errorPayload?.error || `Request failed with status ${res.status}`);
    }

    await fetchData();
  };

  const handleDelete = async (id: string | number) => {
    const res = await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const errorPayload = await res.json().catch(() => null);
      throw new Error(errorPayload?.error || `Request failed with status ${res.status}`);
    }

    if (singleRecord) {
      setData([]);
      return;
    }

    await fetchData();
  };

  return (
    <SectionEditor<T>
      title={title}
      description={description}
      data={data}
      fields={fields}
      isLoading={isLoading}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}
