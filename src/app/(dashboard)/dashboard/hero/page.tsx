"use client";
import { useState, useEffect } from "react";

export default function HeroDashboard() {
  const [data, setData] = useState({ name: "", job_title: "", bio: "" });

  useEffect(() => {
    fetch("/api/hero").then(res => res.json()).then(setData);
  }, []);

  const save = async () => {
    await fetch("/api/hero", { method: "PUT", body: JSON.stringify(data) });
    alert("Hero updated!");
  };

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-3xl font-bold">Manage Hero Section</h2>
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
           <label>Name</label>
           <input className="bg-white/5 border p-3 rounded" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
        </div>
        <div className="flex flex-col gap-2">
           <label>Job Title</label>
           <input className="bg-white/5 border p-3 rounded" value={data.job_title} onChange={e => setData({...data, job_title: e.target.value})} />
        </div>
        <div className="flex flex-col gap-2">
           <label>Bio</label>
           <textarea className="bg-white/5 border p-3 rounded h-32" value={data.bio} onChange={e => setData({...data, bio: e.target.value})} />
        </div>
        <button onClick={save} className="bg-accent text-bg font-bold p-4 rounded-xl">Update Hero</button>
      </div>
    </div>
  );
}