"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string | null;
  projects: { id: string }[];
  invoices: { amount: number; status: string }[];
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "" });

  useEffect(() => {
    fetch("/api/clients").then(r => r.json()).then(d => {
      setClients(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  }, []);

  async function addClient(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    setClients(c => [data, ...c]);
    setForm({ name: "", email: "", company: "", phone: "" });
    setShowForm(false);
    setError("");
  }

  async function deleteClient(id: string) {
    if (!confirm("Delete this client and all their data?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    setClients(c => c.filter(x => x.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">{clients.length} total clients</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          + Add client
        </button>
      </div>

      {/* Add client modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">New client</h2>
            {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-3">{error}</div>}
            <form onSubmit={addClient} className="space-y-3">
              {[
                { label: "Full name *", key: "name", type: "text", placeholder: "Jane Smith" },
                { label: "Email *", key: "email", type: "email", placeholder: "jane@company.com" },
                { label: "Company", key: "company", type: "text", placeholder: "Acme Corp" },
                { label: "Phone", key: "phone", type: "tel", placeholder: "+1 555 000 0000" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    required={f.label.includes("*")}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
                  Add client
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
      ) : clients.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <p className="text-4xl mb-3">👤</p>
          <p className="text-gray-500 mb-4">No clients yet. Add your first one!</p>
          <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
            Add first client
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Company</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Projects</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Revenue</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map(client => {
                const revenue = client.invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
                return (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/clients/${client.id}`} className="hover:text-indigo-600">
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-xs text-gray-400">{client.email}</p>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{client.company ?? "—"}</td>
                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{client.projects.length}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium hidden md:table-cell">
                      ${revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/clients/${client.id}`} className="text-xs text-indigo-600 hover:underline font-medium">
                          View
                        </Link>
                        <button onClick={() => deleteClient(client.id)} className="text-xs text-red-400 hover:text-red-600">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
