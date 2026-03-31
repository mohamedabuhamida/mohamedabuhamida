"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineX } from "react-icons/hi";

export interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "checkbox" | "date" | "url" | "array" | "image";
  placeholder?: string;
  required?: boolean;
}

interface SectionEditorProps<T extends Record<string, any>> {
  title: string;
  description: string;
  data: T[];
  fields: FieldConfig[];
  isLoading?: boolean;
  onSave: (item: T) => Promise<void>;
  onDelete: (id: string | number) => Promise<void>;
}

function toDisplayValue(value: unknown, type?: FieldConfig["type"]) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (type === "date" && typeof value === "string") return value.slice(0, 10);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export default function SectionEditor<T extends Record<string, any>>({
  title,
  description,
  data,
  fields,
  isLoading = false,
  onSave,
  onDelete,
}: SectionEditorProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const previewFields = useMemo(() => fields.slice(0, 3), [fields]);

  const handleOpenModal = (item: T | null = null) => {
    setEditingItem((item ? { ...item } : {}) as T);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSubmitting(true);
    await onSave(editingItem);
    setIsSubmitting(false);
    handleCloseModal();
  };

  const handleImageUpload = async (fieldKey: string, file?: File) => {
    if (!editingItem || !file) return;
    setUploadingField(fieldKey);

    const body = new FormData();
    body.append("file", file);
    body.append("folder", title.toLowerCase());

    const res = await fetch("/api/uploads/image", {
      method: "POST",
      body,
    });

    const payload = await res.json();
    if (res.ok && payload?.url) {
      setEditingItem({ ...editingItem, [fieldKey]: payload.url });
    } else {
      alert(payload?.error || "Image upload failed");
    }

    setUploadingField(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
          <p className="text-text/40 text-sm">{description}</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 text-bg px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95"
        >
          <HiOutlinePlus size={20} />
          Add New
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-text/40">
                {previewFields.map((f) => (
                  <th key={f.key} className="p-5 font-semibold">{f.label}</th>
                ))}
                <th className="p-5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && (
                <tr>
                  <td colSpan={previewFields.length + 1} className="p-10 text-center text-text/40">
                    Loading data...
                  </td>
                </tr>
              )}

              {!isLoading && data.map((item, idx) => (
                <tr key={(item.id as string | number) ?? idx} className="hover:bg-white/5 transition-colors group">
                  {previewFields.map((f) => (
                    <td key={f.key} className="p-5 text-sm text-text/80 max-w-55 truncate">
                      {f.type === "image" && item[f.key] ? (
                        <img src={String(item[f.key])} alt={f.label} className="h-10 w-10 rounded object-cover border border-white/10" />
                      ) : (
                        toDisplayValue(item[f.key], f.type) || <span className="text-text/20">N/A</span>
                      )}
                    </td>
                  ))}
                  <td className="p-5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"
                      title="Edit"
                    >
                      <HiOutlinePencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id as string | number)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Delete"
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {!isLoading && data.length === 0 && (
                <tr>
                  <td colSpan={previewFields.length + 1} className="p-10 text-center text-text/40">
                    No data found. Click "Add New" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                <h3 className="text-xl font-bold">Manage {title}</h3>
                <button onClick={handleCloseModal} className="text-text/40 hover:text-white transition">
                  <HiOutlineX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field) => (
                    <div key={field.key} className={`${field.type === "textarea" ? "md:col-span-2" : "col-span-1"} space-y-2`}>
                      <label className="text-xs font-bold uppercase tracking-widest text-text/40 ml-1">
                        {field.label}
                      </label>

                      {field.type === "textarea" && (
                        <textarea
                          required={field.required ?? false}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all h-32 resize-none"
                          value={toDisplayValue(editingItem[field.key], field.type)}
                          placeholder={field.placeholder}
                          onChange={(e) => setEditingItem({ ...editingItem, [field.key]: e.target.value })}
                        />
                      )}

                      {field.type === "checkbox" && (
                        <label className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/10">
                          <input
                            type="checkbox"
                            checked={Boolean(editingItem[field.key])}
                            onChange={(e) => setEditingItem({ ...editingItem, [field.key]: e.target.checked })}
                            className="h-4 w-4 accent-accent"
                          />
                          <span className="text-sm text-text/70">Enabled</span>
                        </label>
                      )}

                      {field.type === "array" && (
                        <textarea
                          required={field.required ?? false}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all h-24 resize-none"
                          value={toDisplayValue(editingItem[field.key], field.type)}
                          placeholder={field.placeholder || "item1, item2, item3"}
                          onChange={(e) => setEditingItem({ ...editingItem, [field.key]: e.target.value })}
                        />
                      )}

                      {field.type === "image" && (
                        <div className="space-y-3">
                          <input
                            type="url"
                            required={field.required ?? false}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                            value={toDisplayValue(editingItem[field.key], "text")}
                            placeholder={field.placeholder || "https://..."}
                            onChange={(e) => setEditingItem({ ...editingItem, [field.key]: e.target.value })}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(field.key, e.target.files?.[0])}
                            className="w-full text-sm text-text/70"
                          />
                          {uploadingField === field.key ? <p className="text-xs text-accent">Uploading image...</p> : null}
                          {editingItem[field.key] ? (
                            <img src={String(editingItem[field.key])} alt={field.label} className="h-20 w-20 rounded-lg object-cover border border-white/10" />
                          ) : null}
                        </div>
                      )}

                      {(!field.type || field.type === "text" || field.type === "number" || field.type === "date" || field.type === "url") && (
                        <input
                          required={field.required ?? false}
                          type={field.type === "date" || field.type === "url" ? field.type : field.type || "text"}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                          value={toDisplayValue(editingItem[field.key], field.type)}
                          placeholder={field.placeholder}
                          onChange={(e) => {
                            const value = field.type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value;
                            setEditingItem({ ...editingItem, [field.key]: value });
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="flex-1 bg-accent p-4 rounded-2xl text-bg font-bold hover:bg-accent/90 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-white/5 p-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}