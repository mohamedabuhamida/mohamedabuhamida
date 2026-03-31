"use client";

import { useState, useEffect } from "react";
import SectionEditor, { FieldConfig } from "@/components/dashboard/SectionEditor";

// 1. Define the fields with labels and types
const projectFields: FieldConfig[] = [
  { key: "title", label: "Project Title", placeholder: "e.g. AI Chatbot" },
  { key: "description", label: "Description", type: "textarea", placeholder: "Detailed overview of the project..." },
  { key: "tech_stack", label: "Tech Stack", placeholder: "e.g. Next.js, OpenAI, Pinecone" },
  { key: "github_url", label: "GitHub URL", placeholder: "https://github.com/..." },
  { key: "live_url", label: "Live Preview URL", placeholder: "https://project-demo.com" },
  { key: "image_url", label: "Project Image URL", placeholder: "/projects/my-app.png" },
];

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (item: any) => {
    // If item has an ID, we update (PUT), otherwise we create (POST)
    const method = item.id ? "PUT" : "POST";
    
    try {
      const res = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (res.ok) {
        fetchData(); // Refresh the list
      } else {
        alert("Failed to save project");
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        const res = await fetch(`/api/projects?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <SectionEditor 
        title="Projects"
        data={projects}
        fields={projectFields}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}