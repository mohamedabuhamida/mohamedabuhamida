"use client";
import { useState, useEffect } from "react";
import SectionEditor from "@/components/dashboard/SectionEditor";


export default function ProjectsDashboard() {
  const [projects, setProjects] = useState([]);

  const fetchData = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (item: any) => {
    const method = item.id ? "PUT" : "POST";
    await fetch("/api/projects", {
      method,
      body: JSON.stringify(item),
    });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this project?")) {
      await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  return (
    <SectionEditor 
      title="Projects"
      data={projects}
      fields={["title", "description", "tech_stack", "github_url", "live_url"]}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}