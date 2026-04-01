"use client";

import { useEffect, useState } from "react";

type CvMeta = {
  id: number;
  file_name: string;
  file_path: string;
  is_active: boolean;
  created_at?: string;
} | null;

export default function CvDashboardPage() {
  const [activeCv, setActiveCv] = useState<CvMeta>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCvMeta = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cv/meta", { cache: "no-store" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load CV details");
      }

      setActiveCv(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load CV details";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCvMeta();
  }, []);

  const handleUpload = async (file?: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/cv", {
        method: activeCv ? "PUT" : "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "CV upload failed");
      }

      await loadCvMeta();
    } catch (error) {
      const message = error instanceof Error ? error.message : "CV upload failed";
      alert(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!activeCv) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/cv", { method: "DELETE" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete CV");
      }

      setActiveCv(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete CV";
      alert(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">CV</h2>
        <p className="mt-2 text-text/50">
          Upload or replace the active resume PDF used by the public hero section.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-text/40">
            Active Resume
          </p>

          {isLoading ? (
            <p className="text-text/50">Loading current CV...</p>
          ) : activeCv ? (
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 space-y-2">
              <p className="text-lg font-bold text-white break-all">{activeCv.file_name}</p>
              <p className="text-sm text-text/50">
                Uploaded{" "}
                {activeCv.created_at
                  ? new Date(activeCv.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "recently"}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 p-5 text-text/50">
              No active CV uploaded yet.
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-[0.25em] text-text/40">
            Upload PDF
          </label>
          <input
            type="file"
            accept="application/pdf"
            disabled={isUploading || isDeleting}
            onChange={(e) => handleUpload(e.target.files?.[0])}
            className="block w-full text-sm text-text/70 file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-bg hover:file:bg-accent/90"
          />
          <p className="text-sm text-text/40">
            Max size: 5MB. Uploading a new file replaces the current active CV.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <a
            href="/api/cv"
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-2xl px-5 py-3 text-center font-bold transition ${
              activeCv
                ? "bg-accent text-bg hover:bg-accent/90"
                : "pointer-events-none bg-white/5 text-text/30"
            }`}
          >
            Open Current CV
          </a>

          <button
            type="button"
            disabled={!activeCv || isDeleting || isUploading}
            onClick={handleDelete}
            className="rounded-2xl border border-red-400/20 px-5 py-3 font-bold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Current CV"}
          </button>
        </div>

        {(isUploading || isDeleting) && (
          <p className="text-sm text-accent">
            {isUploading ? "Uploading CV..." : "Deleting CV..."}
          </p>
        )}
      </div>
    </section>
  );
}
