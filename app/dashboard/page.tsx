"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency, statusColor } from "@/lib/utils";

interface DashboardData {
  clients: number;
  totalRevenue: number;
  pendingRevenue: number;
  activeProjects: number;
  recentProjects: Array<{
    id: string;
    title: string;
    status: string;
    client: { name: string };
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with your business</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Clients", value: data.clients, sub: "total clients", icon: "👤" },
          { label: "Active Projects", value: data.activeProjects, sub: "in progress", icon: "📁" },
          { label: "Revenue Collected", value: formatCurrency(data.totalRevenue), sub: "all time", icon: "💰" },
          { label: "Pending Invoices", value: formatCurrency(data.pendingRevenue), sub: "awaiting payment", icon: "⏳" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{stat.label}</p>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent projects */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Projects</h2>
          <Link href="/dashboard/projects" className="text-sm text-indigo-600 hover:underline font-medium">
            View all
          </Link>
        </div>
        {data.recentProjects.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-sm mb-4">No projects yet</p>
            <Link
              href="/dashboard/projects"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Create first project
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.recentProjects.map(project => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{project.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{project.client.name}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(project.status)}`}>
                  {project.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {[
          { href: "/dashboard/clients", label: "Add client", icon: "👤", color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
          { href: "/dashboard/projects", label: "New project", icon: "📁", color: "bg-green-50 text-green-700 hover:bg-green-100" },
          { href: "/dashboard/invoices", label: "Create invoice", icon: "🧾", color: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
        ].map(action => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${action.color}`}
          >
            <span>{action.icon}</span> {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
