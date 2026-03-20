"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { statusColor, formatDate } from "@/lib/utils";

interface Client { id: string; name: string }
interface Project {
  id: string;
  title: string;
  status: string;
  client: Client;
  deliverables: { id: string }[];
  createdAt: string;
  deadline: string | null;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", clientId: "", status: "active", deadline: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then(r => r.json()),
      fetch("/api/clients").then(r => r.json()),
    ]).then(([p, c]) => {
      setProjects(Array.isArray(p) ? p : []);
      setClients(Array.isArray(c) ? c : []);
      setLoading(false);
    });
  }, []);

  async function addProject(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    setProjects(p => [data, ...p]);
    setForm({ title: "", description: "", clientId: "", status: "active", deadline: "" });
    setShowForm(false);
    setError("");
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects(p => p.filter(x => x.id !== id));
  }

  const statuses = ["active", "review", "completed", "archived"];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} total projects</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          + New project
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">New project</h2>
            {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-3">{error}</div>}
            {clients.length === 0 && (
              <div className="bg-yellow-50 text-yellow-700 text-sm px-3 py-2 rounded-lg mb-3">
                You need to <Link href="/dashboard/clients" className="underline font-medium">add a client</Link> first.
              </div>
            )}
            <form onSubmit={addProject} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project title *</label>
                <input
                  type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  required placeholder="Website redesign"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                <select
                  value={form.clientId} onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={2} placeholder="Brief project overview..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
                  Create project
                </button>
                <button type="button" onClick={() => { setShowForm(false); setError(""); }} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <p className="text-4xl mb-3">📁</p>
          <p className="text-gray-500 mb-4">No projects yet.</p>
          <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
            Create first project
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(project.status)}`}>
                  {project.status}
                </span>
                <button onClick={() => deleteProject(project.id)} className="text-gray-300 hover:text-red-400 text-xs">✕</button>
              </div>
              <Link href={`/dashboard/projects/${project.id}`}>
                <h3 className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors mb-1">{project.title}</h3>
              </Link>
              <p className="text-xs text-gray-500 mb-3">{project.client.name}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{project.deliverables.length} deliverables</span>
                {project.deadline && <span>Due {formatDate(project.deadline)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
