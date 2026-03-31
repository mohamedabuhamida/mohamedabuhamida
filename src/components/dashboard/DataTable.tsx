"use client";
import { useState } from "react";

interface Props {
  title: string;
  data: any[];
  fields: string[];
  onSave: (item: any) => void;
  onDelete: (id: string) => void;
}

export default function SectionEditor({ title, data, fields, onSave, onDelete }: Props) {
  const [editingItem, setEditingItem] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{title}</h2>
        <button 
          onClick={() => setEditingItem({})}
          className="bg-accent text-bg px-4 py-2 rounded-lg font-bold"
        >
          + Add New
        </button>
      </div>

      {/* Simple Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 uppercase text-xs font-mono text-text/40">
            <tr>
              {fields.map(f => <th key={f} className="p-4">{f}</th>)}
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t border-white/5 hover:bg-white/5 transition">
                {fields.map(f => (
                  <td key={f} className="p-4 text-sm truncate max-w-[200px]">
                    {item[f]?.toString() || "-"}
                  </td>
                ))}
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => setEditingItem(item)} className="text-blue-400">Edit</button>
                  <button onClick={() => onDelete(item.id)} className="text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple Modal for Editing/Adding */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-6">Manage {title}</h3>
            <form onSubmit={(e) => {
                e.preventDefault();
                onSave(editingItem);
                setEditingItem(null);
            }} className="grid grid-cols-2 gap-4">
              {fields.map(f => (
                <div key={f} className="flex flex-col gap-2">
                  <label className="text-xs uppercase text-text/40">{f}</label>
                  <input 
                    className="bg-white/5 border border-white/10 rounded-lg p-2 text-white"
                    value={editingItem[f] || ""}
                    onChange={(e) => setEditingItem({...editingItem, [f]: e.target.value})}
                  />
                </div>
              ))}
              <div className="col-span-2 flex gap-4 mt-6">
                <button type="submit" className="flex-1 bg-accent p-3 rounded-lg text-bg font-bold">Save Changes</button>
                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 bg-white/10 p-3 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}