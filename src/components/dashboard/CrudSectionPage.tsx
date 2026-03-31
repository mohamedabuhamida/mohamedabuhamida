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

    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await fetchData();
  };

  const handleDelete = async (id: string | number) => {
    await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

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