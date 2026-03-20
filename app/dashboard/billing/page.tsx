"use client";
import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  plan: string;
}

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    features: ["3 active clients", "Unlimited projects", "Client portals", "Invoicing", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 79,
    features: ["Unlimited clients", "Unlimited projects", "Custom domain", "White-label portals", "Priority support"],
    popular: true,
  },
];

export default function BillingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user));
  }, []);

  async function upgradeToPro() {
    setUpgrading(true);
    // In production: redirect to Stripe Checkout
    // For demo: simulate upgrade
    await new Promise(r => setTimeout(r, 1500));
    await fetch("/api/auth/me"); // refresh
    setUpgrading(false);
    setUpgraded(true);
  }

  if (!user) return <div className="text-gray-400 text-sm py-12 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Plan</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your subscription</p>
      </div>

      {/* Current plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Current plan</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.plan === "pro" ? "bg-indigo-600" : "bg-gray-100"}`}>
              <span className={user.plan === "pro" ? "text-white" : "text-gray-600"}>
                {user.plan === "pro" ? "⭐" : "📦"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 capitalize">{user.plan} Plan</p>
              <p className="text-sm text-gray-500">
                {user.plan === "starter" ? "$29/month · Up to 3 clients" : "$79/month · Unlimited clients"}
              </p>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            user.plan === "pro" ? "bg-indigo-100 text-indigo-700" : "bg-green-100 text-green-700"
          }`}>
            ACTIVE
          </span>
        </div>
      </div>

      {/* Plans */}
      <div className="grid sm:grid-cols-2 gap-5">
        {plans.map(plan => {
          const current = user.plan === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-2xl border-2 p-6 transition-all ${
                current
                  ? "border-indigo-600 bg-indigo-50"
                  : plan.popular
                  ? "border-indigo-200 bg-white hover:border-indigo-400"
                  : "border-gray-200 bg-white"
              }`}
            >
              {plan.popular && !current && (
                <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full mb-3 inline-block">
                  POPULAR
                </span>
              )}
              {current && (
                <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full mb-3 inline-block">
                  CURRENT PLAN
                </span>
              )}
              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <div className="flex items-end gap-1 my-2">
                <span className="text-3xl font-extrabold text-gray-900">${plan.price}</span>
                <span className="text-gray-500 mb-0.5">/month</span>
              </div>
              <ul className="space-y-1.5 text-sm text-gray-600 my-4">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              {current ? (
                <div className="text-center text-sm text-indigo-600 font-medium py-2">
                  ✓ Your current plan
                </div>
              ) : plan.id === "pro" ? (
                <button
                  onClick={upgradeToPro}
                  disabled={upgrading || upgraded}
                  className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {upgrading ? "Processing..." : upgraded ? "Redirecting to Stripe..." : "Upgrade to Pro →"}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full border border-gray-200 text-gray-400 py-2.5 rounded-xl font-semibold text-sm cursor-not-allowed"
                >
                  Downgrade
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Stripe info */}
      <div className="mt-8 bg-gray-50 rounded-xl border border-gray-200 p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Secure payments via Stripe</p>
            <p className="text-xs text-gray-500 mt-1">
              Your payment is processed securely by Stripe. We never store your card details.
              Cancel anytime from your account — no questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
