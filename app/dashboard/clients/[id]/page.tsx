"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatCurrency, formatDate, statusColor } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  projects: Array<{ id: string; title: string; status: string; createdAt: string }>;
  invoices: Array<{ id: string; amount: number; status: string; dueDate: string | null; createdAt: string }>;
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    fetch(`/api/clients/${id}`).then(r => r.json()).then(setClient);
  }, [id]);

  if (!client) return <div className="text-gray-400 text-sm py-12 text-center">Loading...</div>;

  const totalRevenue = client.invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pendingRevenue = client.invoices.filter(i => i.status === "sent").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard/clients" className="hover:text-indigo-600">Clients</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{client.name}</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            {client.company && <p className="text-gray-500 mt-0.5">{client.company}</p>}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span>✉️ {client.email}</span>
              {client.phone && <span>📞 {client.phone}</span>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Revenue</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            {pendingRevenue > 0 && (
              <p className="text-xs text-yellow-600">{formatCurrency(pendingRevenue)} pending</p>
            )}
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Projects</h2>
          <Link href="/dashboard/projects" className="text-sm text-indigo-600 hover:underline">+ New project</Link>
        </div>
        {client.projects.length === 0 ? (
          <p className="text-gray-400 text-sm px-6 py-6">No projects yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {client.projects.map(p => (
              <Link
                key={p.id}
                href={`/dashboard/projects/${p.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.title}</p>
                  <p className="text-xs text-gray-400">{formatDate(p.createdAt)}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(p.status)}`}>
                  {p.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Invoices</h2>
          <Link href="/dashboard/invoices" className="text-sm text-indigo-600 hover:underline">+ New invoice</Link>
        </div>
        {client.invoices.length === 0 ? (
          <p className="text-gray-400 text-sm px-6 py-6">No invoices yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {client.invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(inv.amount)}</p>
                  <p className="text-xs text-gray-400">
                    {inv.dueDate ? `Due ${formatDate(inv.dueDate)}` : formatDate(inv.createdAt)}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(inv.status)}`}>
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
