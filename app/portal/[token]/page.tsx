"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  client: { name: string; email: string };
  user: { name: string; email: string };
  deliverables: Deliverable[];
  messages: Message[];
}

export default function ClientPortalPage() {
  const { token } = useParams<{ token: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [clientName, setClientName] = useState("");
  const [hasSetName, setHasSetName] = useState(false);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  const refresh = () =>
    fetch(`/api/portal/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setNotFound(true);
        else setProject(d);
      });

  useEffect(() => { refresh(); }, [token]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !clientName.trim()) return;
    await fetch(`/api/projects/${project!.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage, senderType: "client", senderName: clientName }),
    });
    setNewMessage("");
    refresh();
  }

  async function updateDeliverable(id: string, status: string, feedback?: string) {
    await fetch(`/api/deliverables/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, feedback: feedback ?? undefined }),
    });
    setFeedbackId(null);
    setFeedbackText("");
    refresh();
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal not found</h1>
          <p className="text-gray-500">This link may have expired or is incorrect.</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">Loading your project...</div>
      </div>
    );
  }

  if (!hasSetName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👋</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome to your project portal</h1>
          <p className="text-sm text-gray-500 mb-6">
            <strong>{project.user.name}</strong> has shared <strong>{project.title}</strong> with you
          </p>
          <input
            type="text"
            value={clientName}
            onChange={e => setClientName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
          />
          <button
            onClick={() => clientName.trim() && setHasSetName(true)}
            disabled={!clientName.trim()}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            View project →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">CF</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{project.title}</p>
              <p className="text-xs text-gray-400">Shared by {project.user.name}</p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Project info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">{project.title}</h2>
          {project.description && <p className="text-sm text-gray-500">{project.description}</p>}
          {project.deadline && (
            <p className="text-xs text-gray-400 mt-2">📅 Due {formatDate(project.deadline)}</p>
          )}
        </div>

        {/* Deliverables */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Deliverables</h2>
            <p className="text-xs text-gray-400 mt-0.5">Review and approve each item below</p>
          </div>
          {project.deliverables.length === 0 ? (
            <p className="text-gray-400 text-sm px-5 py-6">Nothing shared yet. Check back soon.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {project.deliverables.map(d => (
                <div key={d.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-sm shrink-0 mt-0.5">📄</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{d.title}</p>
                        {d.fileUrl && (
                          <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">
                            View file ↗
                          </a>
                        )}
                        {d.feedback && d.status === "revision" && (
                          <p className="text-xs text-red-500 mt-1">Your feedback: {d.feedback}</p>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(d.status)}`}>
                        {d.status}
                      </span>
                    </div>
                  </div>

                  {d.status === "pending" && (
                    <div className="mt-3 flex flex-col gap-2">
                      {feedbackId === d.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={feedbackText}
                            onChange={e => setFeedbackText(e.target.value)}
                            placeholder="What needs to change?"
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => updateDeliverable(d.id, "revision", feedbackText)}
                            className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-200"
                          >
                            Submit
                          </button>
                          <button onClick={() => setFeedbackId(null)} className="text-gray-400 text-xs px-2">✕</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateDeliverable(d.id, "approved")}
                            className="flex-1 bg-green-100 text-green-700 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => setFeedbackId(d.id)}
                            className="flex-1 bg-red-100 text-red-700 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors"
                          >
                            ✎ Request revision
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Messages</h2>
            <p className="text-xs text-gray-400 mt-0.5">Chat with {project.user.name}</p>
          </div>
          <div className="px-5 py-4 space-y-3 min-h-20 max-h-64 overflow-y-auto">
            {project.messages.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-2">No messages yet.</p>
            ) : (
              project.messages.map(m => (
                <div key={m.id} className={`flex ${m.senderType === "client" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                    m.senderType === "client"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}>
                    <p className="text-xs opacity-60 mb-0.5">{m.senderName}</p>
                    <p>{m.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-5 py-4 border-t border-gray-100">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
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
    </div>
  );
}
