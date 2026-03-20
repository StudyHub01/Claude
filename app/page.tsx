import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CF</span>
          </div>
          <span className="font-bold text-xl text-gray-900">Clientflow</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            Log in
          </Link>
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Start free trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-indigo-50 to-white">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          ✦ Built for freelancers & agencies
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 max-w-3xl leading-tight mb-6">
          Stop losing deals<br />in email threads
        </h1>
        <p className="text-xl text-gray-500 max-w-xl mb-10">
          Clientflow gives you a branded portal to share work, collect approvals, and get paid — all in one place. Your clients will love it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Start free — no credit card
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-900 text-base font-medium px-4 py-4">
            See a demo →
          </Link>
        </div>

        {/* Mock UI preview */}
        <div className="mt-16 w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-gray-400 ml-2">clientflow.app/portal/abc123</span>
          </div>
          <div className="p-6 text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Project</p>
                <h3 className="text-xl font-bold text-gray-900">Brand Refresh 2025</h3>
                <p className="text-sm text-gray-500">Acme Corp · Due Apr 15</p>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Active</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Logo Suite v2.pdf", status: "approved", statusColor: "bg-green-100 text-green-700" },
                { name: "Brand Guidelines.pdf", status: "revision", statusColor: "bg-red-100 text-red-700" },
                { name: "Social Templates.zip", status: "pending", statusColor: "bg-yellow-100 text-yellow-700" },
              ].map((d) => (
                <div key={d.name} className="border border-gray-200 rounded-lg p-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded mb-2 flex items-center justify-center">
                    <span className="text-indigo-600 text-xs">📄</span>
                  </div>
                  <p className="text-xs font-medium text-gray-800 truncate">{d.name}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${d.statusColor}`}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Everything you need</h2>
        <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
          Stop juggling 6 different tools. Clientflow handles your entire client workflow in one place.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "🔗", title: "Shareable Client Portals", desc: "Each project gets a unique URL. Clients can view progress without creating an account." },
            { icon: "✅", title: "One-Click Approvals", desc: "Clients approve or request revisions on deliverables. No more 'see attached' emails." },
            { icon: "💬", title: "Threaded Messaging", desc: "Every project has a dedicated message thread. Nothing gets lost in your inbox." },
            { icon: "🧾", title: "Invoice & Payments", desc: "Create invoices, send them to clients, and track what's paid and what's overdue." },
            { icon: "📊", title: "Revenue Dashboard", desc: "See your MRR, active projects, and outstanding payments at a glance." },
            { icon: "🔒", title: "Client Limit Enforcement", desc: "Built-in plan enforcement. Upgrade prompts when your business grows." },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Simple pricing</h2>
          <p className="text-center text-gray-500 mb-12">No per-seat fees. No surprises.</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Starter</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-extrabold text-gray-900">$29</span>
                <span className="text-gray-500 mb-1">/month</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">Up to 3 active clients</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-8">
                {["3 active clients", "Unlimited projects", "Client portals", "Invoicing", "Email support"].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center border border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
                Start free trial
              </Link>
            </div>
            <div className="bg-indigo-600 border border-indigo-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold uppercase tracking-wide opacity-80">Pro</p>
                <span className="bg-white text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">POPULAR</span>
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-extrabold">$79</span>
                <span className="opacity-70 mb-1">/month</span>
              </div>
              <p className="text-sm opacity-60 mb-6">Unlimited clients</p>
              <ul className="space-y-2 text-sm mb-8">
                {["Unlimited clients", "Unlimited projects", "Custom domain", "White-label portals", "Priority support"].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="opacity-80">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center bg-white text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center text-sm text-gray-400">
        <span className="font-semibold text-gray-600">Clientflow</span> · Built for freelancers who mean business
      </footer>
    </div>
  );
}
