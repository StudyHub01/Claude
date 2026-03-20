"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { statusColor, formatDate } from "@/lib/utils";

interface Deliverable {
  id: string;
  title: string;
  fileUrl: string | null;
  status: string;
  feedback: string | null;
  createdAt: string;
}
interface Message {
  id: string;
  content: string;
  senderType: string;
  senderName: string;
  createdAt: string;
}
interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  deadline: string | null;
  portalToken: string;
  client: { id: string; name: string; email: string };
  deliverables: Deliverable[];
  messages: Message[];
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [newDeliverable, setNewDeliverable] = useState({ title: "", fileUrl: "" });
  const [newMessage, setNewMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [showAddDeliverable, setShowAddDeliverable] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${id}`).then(r => r.json()).then(setProject);
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (d.user) setUserName(d.user.name); });
  }, [id]);

  const refresh = () => fetch(`/api/projects/${id}`).then(r => r.json()).then(setProject);

  async function addDeliverable(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/projects/${id}/deliverables`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDeliverable),
    });
    setNewDeliverable({ title: "", fileUrl: "" });
    setShowAddDeliverable(false);
    refresh();
  }

  async function updateDeliverableStatus(did: string, status: string) {
    await fetch(`/api/deliverables/${did}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refresh();
  }

  async function deleteDeliverable(did: string) {
    await fetch(`/api/deliverables/${did}`, { method: "DELETE" });
    refresh();
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await fetch(`/api/projects/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage, senderType: "freelancer", senderName: userName }),
    });
    setNewMessage("");
    refresh();
  }

  async function updateStatus(status: string) {
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refresh();
  }

  function copyPortalLink() {
    if (!project) return;
    navigator.clipboard.writeText(`${window.location.origin}/portal/${project.portalToken}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!project) return <div className="text-gray-400 text-sm py-12 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard/projects" className="hover:text-indigo-600">Projects</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{project.title}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
            <Link href={`/dashboard/clients/${project.client.id}`} className="text-sm text-indigo-600 hover:underline mt-0.5 block">
              {project.client.name}
            </Link>
            {project.description && <p className="text-sm text-gray-500 mt-2">{project.description}</p>}
            {project.deadline && <p className="text-xs text-gray-400 mt-1">Due {formatDate(project.deadline)}</p>}
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <select
              value={project.status}
              onChange={e => updateStatus(e.target.value)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 ${statusColor(project.status)} cursor-pointer`}
            >
              {["active", "review", "completed", "archived"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={copyPortalLink}
              className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-full font-semibold transition-colors"
            >
              {copied ? "Copied!" : "📋 Copy client link"}
            </button>
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Deliverables</h2>
          <button
            onClick={() => setShowAddDeliverable(true)}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            + Add
          </button>
        </div>

        {showAddDeliverable && (
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <form onSubmit={addDeliverable} className="flex gap-3">
              <input
                type="text" value={newDeliverable.title} onChange={e => setNewDeliverable(p => ({ ...p, title: e.target.value }))}
                required placeholder="Deliverable title (e.g. Logo Suite v1)"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="url" value={newDeliverable.fileUrl} onChange={e => setNewDeliverable(p => ({ ...p, fileUrl: e.target.value }))}
                placeholder="File URL (optional)"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">Add</button>
              <button type="button" onClick={() => setShowAddDeliverable(false)} className="text-gray-400 hover:text-gray-600 px-2">✕</button>
            </form>
          </div>
        )}

        {project.deliverables.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400 text-sm">
            No deliverables yet. Add one to share with your client.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {project.deliverables.map(d => (
              <div key={d.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-sm">📄</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{d.title}</p>
                    {d.fileUrl && (
                      <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">
                        View file ↗
                      </a>
                    )}
                    {d.feedback && <p className="text-xs text-red-500 mt-0.5">Feedback: {d.feedback}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={d.status}
                    onChange={e => updateDeliverableStatus(d.id, e.target.value)}
                    className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${statusColor(d.status)}`}
                  >
                    {["pending", "approved", "revision"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => deleteDeliverable(d.id)} className="text-gray-300 hover:text-red-400 text-xs ml-1">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Messages</h2>
          <p className="text-xs text-gray-400 mt-0.5">Chat with {project.client.name}</p>
        </div>
        <div className="px-6 py-4 space-y-3 min-h-24 max-h-72 overflow-y-auto">
          {project.messages.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No messages yet. Start the conversation.</p>
          ) : (
            project.messages.map(m => (
              <div key={m.id} className={`flex ${m.senderType === "freelancer" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  m.senderType === "freelancer"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}>
                  <p className="text-xs opacity-60 mb-1">{m.senderName}</p>
                  <p>{m.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
