"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";
import SectionEditor, { FieldConfig } from "@/components/dashboard/SectionEditor";

type KnowledgeItem = {
  id?: number;
  title: string;
  category: string;
  content: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type ParsedMarkdownChunk = {
  title: string;
  content: string;
};

const endpoint = "/api/profile-knowledge";

const fields: FieldConfig[] = [
  { key: "title", label: "Title", placeholder: "LLM and RAG Experience", required: true },
  { key: "category", label: "Category", placeholder: "experience, project, contact, skill" },
  {
    key: "content",
    label: "Knowledge Content",
    type: "textarea",
    placeholder: "Write one focused fact, bio section, project summary, FAQ answer, or contact detail.",
    required: true,
  },
  { key: "is_active", label: "Active", type: "checkbox" },
];

function titleFromFileName(fileName: string) {
  return fileName
    .replace(/\.(md|markdown|txt)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseMarkdownChunks(markdown: string, fileName: string): ParsedMarkdownChunk[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const chunks: ParsedMarkdownChunk[] = [];
  let currentTitle = titleFromFileName(fileName) || "Profile Knowledge";
  let currentLines: string[] = [];
  let hasHeading = false;

  const pushChunk = () => {
    const content = currentLines.join("\n").trim();

    if (content) {
      chunks.push({
        title: currentTitle.slice(0, 180),
        content,
      });
    }
  };

  for (const line of lines) {
    const headingMatch = /^(#{1,3})\s+(.+)$/.exec(line.trim());

    if (headingMatch) {
      hasHeading = true;
      pushChunk();
      currentTitle = headingMatch[2].trim();
      currentLines = [];
      continue;
    }

    currentLines.push(line);
  }

  pushChunk();

  if (!hasHeading && chunks.length === 0 && markdown.trim()) {
    return [
      {
        title: titleFromFileName(fileName) || "Profile Knowledge",
        content: markdown.trim(),
      },
    ];
  }

  return chunks;
}

export default function ProfileKnowledgeDashboardPage() {
  const [data, setData] = useState<KnowledgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [markdownCategory, setMarkdownCategory] = useState("profile");
  const [markdownChunks, setMarkdownChunks] = useState<ParsedMarkdownChunk[]>([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const previewChunks = useMemo(() => markdownChunks.slice(0, 5), [markdownChunks]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Failed to load AI knowledge.");
      }

      setData(Array.isArray(payload) ? payload : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load AI knowledge.";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (item: KnowledgeItem) => {
    const response = await fetch(endpoint, {
      method: item.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...item,
        category: item.category || "general",
        is_active: item.is_active ?? true,
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.error || `Request failed with status ${response.status}`);
    }

    await fetchData();
  };

  const handleDelete = async (id: string | number) => {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.error || `Request failed with status ${response.status}`);
    }

    await fetchData();
  };

  const handleMarkdownFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const markdown = await file.text();
    const chunks = parseMarkdownChunks(markdown, file.name);
    setSelectedFileName(file.name);
    setMarkdownChunks(chunks);
    setImportStatus(chunks.length ? null : "No markdown content was found in this file.");
  };

  const handleImportMarkdown = async () => {
    if (!markdownChunks.length || isImporting) return;

    setIsImporting(true);
    setImportStatus(`Importing 0 of ${markdownChunks.length} chunks...`);

    try {
      for (let index = 0; index < markdownChunks.length; index += 1) {
        const chunk = markdownChunks[index];
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: chunk.title,
            content: chunk.content,
            category: markdownCategory || "profile",
            is_active: true,
          }),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(payload?.error || `Import failed at chunk ${index + 1}.`);
        }

        setImportStatus(`Importing ${index + 1} of ${markdownChunks.length} chunks...`);
      }

      setImportStatus(`Imported ${markdownChunks.length} chunks from ${selectedFileName}.`);
      setMarkdownChunks([]);
      setSelectedFileName("");
      await fetchData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Markdown import failed.";
      setImportStatus(message);
    } finally {
      setIsImporting(false);
    }
  };

  const clearMarkdownUpload = () => {
    setMarkdownChunks([]);
    setSelectedFileName("");
    setImportStatus(null);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Upload Markdown Knowledge</h2>
                <p className="text-sm text-text/45">
                  Import an .md file as vector-searchable knowledge chunks.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="space-y-1">
              <span className="block text-xs font-bold uppercase tracking-widest text-text/40">Category</span>
              <input
                value={markdownCategory}
                onChange={(event) => setMarkdownCategory(event.target.value)}
                className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-accent"
                placeholder="profile"
              />
            </label>

            <label className="mt-5 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-bg transition hover:bg-accent/90 active:scale-95">
              <Upload size={17} />
              Choose Markdown
              <input
                type="file"
                accept=".md,.markdown,.txt,text/markdown,text/plain"
                onChange={handleMarkdownFile}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {selectedFileName ? (
          <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-white">{selectedFileName}</p>
                <p className="text-sm text-text/45">{markdownChunks.length} chunks ready</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={clearMarkdownUpload}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-sm text-text/70 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={16} />
                  Clear
                </button>
                <button
                  type="button"
                  disabled={!markdownChunks.length || isImporting}
                  onClick={handleImportMarkdown}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-bg transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isImporting ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                  Import
                </button>
              </div>
            </div>

            {previewChunks.length ? (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {previewChunks.map((chunk, index) => (
                  <div key={`${chunk.title}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="truncate text-sm font-bold text-white">{chunk.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text/45">{chunk.content}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {markdownChunks.length > previewChunks.length ? (
              <p className="mt-3 text-xs text-text/40">
                Showing {previewChunks.length} of {markdownChunks.length} chunks.
              </p>
            ) : null}
          </div>
        ) : null}

        {importStatus ? <p className="mt-4 text-sm text-accent">{importStatus}</p> : null}
      </section>

      <SectionEditor<KnowledgeItem>
        title="AI Knowledge"
        description="Manage the facts used by the floating Gemini assistant. Saving regenerates the vector embedding."
        data={data}
        fields={fields}
        isLoading={isLoading}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
