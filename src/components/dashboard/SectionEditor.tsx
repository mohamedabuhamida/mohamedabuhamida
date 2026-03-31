"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineX } from "react-icons/hi";

// Define the structure for dynamic fields
export interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number";
  placeholder?: string;
}

interface SectionEditorProps {
  title: string;
  data: any[];
  fields: FieldConfig[];
  onSave: (item: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function SectionEditor({ title, data, fields, onSave, onDelete }: SectionEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (item: any = null) => {
    setEditingItem(item || {});
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(editingItem);
    setIsSubmitting(false);
    handleCloseModal();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
          <p className="text-text/40 text-sm">Manage your portfolio {title.toLowerCase()} data.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 text-bg px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95"
        >
          <HiOutlinePlus size={20} />
          Add New
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-text/40">
                {fields.slice(0, 3).map((f) => (
                  <th key={f.key} className="p-5 font-semibold">{f.label}</th>
                ))}
                <th className="p-5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-white/5 transition-colors group">
                  {fields.slice(0, 3).map((f) => (
                    <td key={f.key} className="p-5 text-sm text-text/80 max-w-[200px] truncate">
                      {item[f.key] || <span className="text-text/20">N/A</span>}
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
                      onClick={() => onDelete(item.id)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Delete"
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={fields.length + 1} className="p-10 text-center text-text/40">
                    No data found. Click &quot;Add New&quot; to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isOpen && (
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
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                <h3 className="text-xl font-bold">Manage {title}</h3>
                <button onClick={handleCloseModal} className="text-text/40 hover:text-white transition">
                  <HiOutlineX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((f) => (
                    <div key={f.key} className={`${f.type === "textarea" ? "md:col-span-2" : "col-span-1"} space-y-2`}>
                      <label className="text-xs font-bold uppercase tracking-widest text-text/40 ml-1">
                        {f.label}
                      </label>
                      {f.type === "textarea" ? (
                        <textarea
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all h-32 resize-none"
                          value={editingItem[f.key] || ""}
                          placeholder={f.placeholder}
                          onChange={(e) => setEditingItem({ ...editingItem, [f.key]: e.target.value })}
                        />
                      ) : (
                        <input
                          required
                          type={f.type || "text"}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                          value={editingItem[f.key] || ""}
                          placeholder={f.placeholder}
                          onChange={(e) => setEditingItem({ ...editingItem, [f.key]: e.target.value })}
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