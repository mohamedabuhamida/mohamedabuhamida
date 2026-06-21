"use client";

import { useEffect, useMemo, useState } from "react";
import { Archive, Copy, File, FileImage, FilePlus2, FileText, FileVideo, LoaderCircle, Music, PencilLine, RefreshCw, Trash2, Upload } from "lucide-react";
import { formatBlogDate } from "@/lib/blog-utils";
import type { StorageBucket, StorageImage } from "@/types";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }

  return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function getFolderOptions(items: StorageImage[]) {
  return Array.from(new Set(items.map((item) => item.folder || "root"))).sort((a, b) => a.localeCompare(b));
}

function isImageFile(mimeType: string) {
  return mimeType.startsWith("image/");
}

function getFileKind(mimeType: string) {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.includes("pdf") || mimeType.includes("text")) return "document";
  if (mimeType.includes("zip") || mimeType.includes("compressed") || mimeType.includes("archive")) return "archive";
  return "file";
}

function FileKindPreview({ item }: { item: StorageImage }) {
  if (isImageFile(item.mimeType)) {
    return <img src={item.url} alt={item.name} className="h-full w-full object-cover" />;
  }

  const kind = getFileKind(item.mimeType);
  const Icon =
    kind === "video"
      ? FileVideo
      : kind === "audio"
        ? Music
        : kind === "document"
          ? FileText
          : kind === "archive"
            ? Archive
            : File;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-black/40 px-4 text-center text-text/60">
      <Icon className="h-12 w-12 text-accent" />
      <div>
        <p className="line-clamp-2 text-sm font-semibold text-white">{item.name}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-text/35">{item.mimeType || "Unknown file"}</p>
      </div>
    </div>
  );
}

export default function StorageManager() {
  const [buckets, setBuckets] = useState<StorageBucket[]>([]);
  const [selectedBucket, setSelectedBucket] = useState("blogs");
  const [items, setItems] = useState<StorageImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [folderFilter, setFolderFilter] = useState("all");
  const [uploadFolder, setUploadFolder] = useState("dashboard");

  const refreshBuckets = async () => {
    try {
      const response = await fetch("/api/storage/images?mode=buckets", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load buckets.");
      }

      setBuckets(data);

      if (Array.isArray(data) && data.length > 0) {
        setSelectedBucket((current) => (data.some((bucket: StorageBucket) => bucket.name === current) ? current : data[0].name));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load buckets.";
      setStatusMessage(message);
    }
  };

  const refreshItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/storage/images?bucket=${selectedBucket}`, { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load bucket images.");
      }

      setItems(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load bucket images.";
      setStatusMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshBuckets();
  }, []);

  useEffect(() => {
    if (!selectedBucket) return;
    refreshItems();
  }, [selectedBucket]);

  const filteredItems = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return items.filter((item) => {
      const matchesFolder = folderFilter === "all" || (item.folder || "root") === folderFilter;
      if (!matchesFolder) return false;

      if (!query) return true;

      return [item.name, item.path, item.folder, item.mimeType].join(" ").toLowerCase().includes(query);
    });
  }, [folderFilter, items, searchValue]);

  const folderOptions = useMemo(() => getFolderOptions(items), [items]);

  const uploadNewFile = async (file?: File) => {
    if (!file) return;

    setIsMutating(true);
    setStatusMessage(null);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("bucket", selectedBucket);
      body.append("folder", uploadFolder.trim() || "dashboard");

      const response = await fetch("/api/storage/images", {
        method: "POST",
        body,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to upload file.");
      }

      setStatusMessage("File uploaded to the bucket.");
      await refreshItems();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload file.";
      setStatusMessage(message);
    } finally {
      setIsMutating(false);
    }
  };

  const replaceFile = async (path: string, file?: File) => {
    if (!file) return;

    setIsMutating(true);
    setStatusMessage(null);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("bucket", selectedBucket);
      body.append("path", path);

      const response = await fetch("/api/storage/images", {
        method: "PUT",
        body,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to replace file.");
      }

      setStatusMessage("File replaced successfully.");
      await refreshItems();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to replace file.";
      setStatusMessage(message);
    } finally {
      setIsMutating(false);
    }
  };

  const renameFile = async (currentPath: string) => {
    const nextPath = window.prompt("Enter the new path for this file.", currentPath)?.trim();
    if (!nextPath || nextPath === currentPath) return;

    setIsMutating(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/storage/images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bucket: selectedBucket,
          fromPath: currentPath,
          toPath: nextPath,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to rename file.");
      }

      setStatusMessage("File path updated.");
      await refreshItems();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to rename file.";
      setStatusMessage(message);
    } finally {
      setIsMutating(false);
    }
  };

  const deleteFile = async (path: string) => {
    const confirmed = window.confirm("Delete this file from the bucket?");
    if (!confirmed) return;

    setIsMutating(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/storage/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bucket: selectedBucket,
          paths: [path],
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to delete file.");
      }

      setStatusMessage("File deleted.");
      await refreshItems();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete file.";
      setStatusMessage(message);
    } finally {
      setIsMutating(false);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setStatusMessage("Public URL copied.");
    } catch {
      setStatusMessage("Failed to copy the URL.");
    }
  };

  const selectedBucketMeta = useMemo(
    () => buckets.find((bucket) => bucket.name === selectedBucket) ?? null,
    [buckets, selectedBucket]
  );

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Media Library</h2>
          <p className="mt-2 max-w-3xl text-sm text-text/55">
            Full access to your Supabase storage buckets. Browse files, upload new ones, replace files, rename paths,
            copy public URLs, and delete assets.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 font-semibold text-bg transition hover:bg-accent/85">
            <FilePlus2 className="h-5 w-5" />
            {isMutating ? "Working..." : "Upload File"}
            <input
              type="file"
              className="hidden"
              onChange={(event) => uploadNewFile(event.target.files?.[0])}
            />
          </label>

          <button
            type="button"
            onClick={refreshItems}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm text-text/80 transition hover:border-accent/40 hover:text-white"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {statusMessage ? (
        <div className="rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-text/85">
          {statusMessage}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[220px,minmax(0,1fr),220px,220px]">
        <select
          value={selectedBucket}
          onChange={(event) => {
            setFolderFilter("all");
            setSelectedBucket(event.target.value);
          }}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-accent/60"
        >
          {buckets.map((bucket) => (
            <option key={bucket.id} value={bucket.name}>
              {bucket.name}
            </option>
          ))}
        </select>

        <input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search by file name, folder, path, or type..."
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-accent/60"
        />

        <select
          value={folderFilter}
          onChange={(event) => setFolderFilter(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-accent/60"
        >
          <option value="all">All folders</option>
          {folderOptions.map((folder) => (
            <option key={folder} value={folder}>
              {folder}
            </option>
          ))}
        </select>

        <input
          value={uploadFolder}
          onChange={(event) => setUploadFolder(event.target.value)}
          placeholder="Upload folder path"
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-accent/60"
        />
      </div>

      {selectedBucketMeta ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-text/70">
          <span className="font-semibold text-white">{selectedBucketMeta.name}</span>
          {selectedBucketMeta.public ? " is public" : " is private"}
          {selectedBucketMeta.fileSizeLimit ? `, max file size ${formatBytes(selectedBucketMeta.fileSizeLimit)}` : ", no file size limit set"}
          {selectedBucketMeta.allowedMimeTypes?.length ? `, allowed types: ${selectedBucketMeta.allowedMimeTypes.join(", ")}` : ", allowed types: any"}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => (
          <article key={item.path} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
            <div className="aspect-[4/3] overflow-hidden bg-black/30">
              <FileKindPreview item={item} />
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="line-clamp-1 font-semibold text-white">{item.name}</p>
                <p className="mt-1 break-all text-xs text-text/45">{item.path}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-text/55">
                <div>
                  <p className="uppercase tracking-[0.16em] text-text/30">Folder</p>
                  <p className="mt-1">{item.folder || "root"}</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.16em] text-text/30">Size</p>
                  <p className="mt-1">{formatBytes(item.size)}</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.16em] text-text/30">Type</p>
                  <p className="mt-1">{item.mimeType}</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.16em] text-text/30">Updated</p>
                  <p className="mt-1">{formatBlogDate(item.updatedAt || item.createdAt)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copyUrl(item.url)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-text/75 transition hover:border-accent/40 hover:text-white"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy URL
                </button>

                <button
                  type="button"
                  onClick={() => renameFile(item.path)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-text/75 transition hover:border-accent/40 hover:text-white"
                >
                  <PencilLine className="h-3.5 w-3.5" />
                  Rename
                </button>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-text/75 transition hover:border-accent/40 hover:text-white">
                  <Upload className="h-3.5 w-3.5" />
                  Replace
                  <input
                    type="file"
                    className="hidden"
                    onChange={(event) => replaceFile(item.path, event.target.files?.[0])}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => deleteFile(item.path)}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!isLoading && filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-sm text-text/45">
          No bucket files found for the current filters.
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-text/50">
          <LoaderCircle className="h-5 w-5 animate-spin" />
        </div>
      ) : null}
    </section>
  );
}
