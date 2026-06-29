"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/Toast";

interface ApiKey {
  id: string;
  key: string;
  name: string;
  usageCount: number;
  usageLimit: number;
  isActive: boolean;
  createdAt: string;
  lastUsedAt: string | null;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
        copied
          ? "bg-green-400/10 border border-green-400/30 text-green-400"
          : "bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10"
      }`}
    >
      {copied ? (
        <>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function UsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min((used / limit) * 100, 100);
  const color = pct >= 90 ? "bg-red-400" : pct >= 70 ? "bg-yellow-400" : "bg-green-400";
  return (
    <div className="flex items-center gap-3 mt-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-white/30 shrink-0 tabular-nums">{used}/{limit}</span>
    </div>
  );
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  const fetchKeys = useCallback(async () => {
    const res = await fetch("/api/keys");
    const data = await res.json();
    setKeys(data.keys ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  const createKey = async () => {
    if (!newName.trim()) { setError("Please enter a name for your key"); return; }
    setCreating(true);
    setError(null);
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setCreating(false); toast(data.error ?? "Failed to create key", "error"); return; }
    setKeys((prev) => [data.key, ...prev]);
    setNewName("");
    setShowForm(false);
    setCreating(false);
    toast("API key created successfully");
  };

  const deleteKey = async (id: string) => {
    if (!confirm("Delete this API key? Any integrations using it will stop working.")) return;
    await fetch(`/api/keys/${id}`, { method: "DELETE" });
    setKeys((prev) => prev.filter((k) => k.id !== id));
    toast("API key deleted", "info");
  };

  const toggleKey = async (id: string, isActive: boolean) => {
    const res = await fetch(`/api/keys/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    const data = await res.json();
    setKeys((prev) => prev.map((k) => k.id === id ? data.key : k));
    toast(isActive ? "Key disabled" : "Key enabled", "info");
  };

  const maskedKey = (key: string) => key.slice(0, 14) + "••••••••••••" + key.slice(-4);

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">API Keys</h1>
          <p className="text-white/40 mt-1 text-sm">{keys.length} of 5 keys created</p>
        </div>
        <button
          onClick={() => {
            if (keys.length >= 5) { toast("You've reached the 5-key limit. Delete an existing key to create a new one.", "error"); return; }
            setShowForm(true); setError(null);
          }}
          disabled={keys.length >= 5}
          title={keys.length >= 5 ? "5-key limit reached — delete an existing key first" : undefined}
          className="flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-bold text-black hover:bg-yellow-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Key
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5">
          <p className="text-sm font-bold text-white mb-3">Create new API key</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createKey()}
              placeholder="e.g. My Shopify Store"
              autoFocus
              className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 transition"
            />
            <div className="flex gap-2">
              <button
                onClick={createKey}
                disabled={creating}
                className="flex-1 sm:flex-none rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-300 transition disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create"}
              </button>
              <button
                onClick={() => { setShowForm(false); setError(null); setNewName(""); }}
                className="flex-1 sm:flex-none rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 transition"
              >
                Cancel
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
        </div>
      )}

      {!showForm && error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {/* Keys */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-36 rounded-2xl border border-white/5 bg-white/3 animate-pulse" />
          ))}
        </div>
      ) : keys.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-8 sm:p-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10 border border-yellow-400/20 mx-auto mb-5">
            <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-white/50 mb-1">No API keys yet</p>
          <p className="text-xs text-white/30 mb-6">Create a key to start using virtual try-on</p>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-300 transition"
          >
            Create first key
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {keys.map((key) => (
            <div key={key.id} className="rounded-2xl border border-white/8 bg-white/3 hover:border-white/12 transition-all p-5">

              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    key.isActive ? "bg-green-400/10 border border-green-400/20" : "bg-white/5 border border-white/8"
                  }`}>
                    <svg className={`h-4 w-4 ${key.isActive ? "text-green-400" : "text-white/25"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{key.name}</p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {new Date(key.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {key.lastUsedAt && (
                        <span className="text-white/20"> · Last used {new Date(key.lastUsedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      )}
                    </p>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                  key.isActive ? "bg-green-400/10 text-green-400" : "bg-white/5 text-white/25"
                }`}>
                  {key.isActive ? "Active" : "Disabled"}
                </span>
              </div>

              {/* Key display */}
              <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-black/40 px-4 py-2.5 mb-4">
                <code className="flex-1 text-xs text-white/40 font-mono truncate">
                  {revealedKeys[key.id] ? key.key : maskedKey(key.key)}
                </code>
                <button
                  onClick={() => setRevealedKeys((p) => ({ ...p, [key.id]: !p[key.id] }))}
                  className="shrink-0 text-white/25 hover:text-white/60 transition p-1"
                  title={revealedKeys[key.id] ? "Hide" : "Reveal"}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {revealedKeys[key.id] ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
                <CopyButton text={key.key} />
              </div>

              {/* Usage */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-white/35">Requests used this month</span>
                  <span className="text-xs font-semibold text-white/50">{Math.round((key.usageCount / key.usageLimit) * 100)}%</span>
                </div>
                <UsageBar used={key.usageCount} limit={key.usageLimit} />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                <button
                  onClick={() => toggleKey(key.id, key.isActive)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition ${
                    key.isActive
                      ? "bg-white/3 border-white/8 text-white/40 hover:text-white/70 hover:bg-white/8"
                      : "bg-green-400/10 border-green-400/20 text-green-400 hover:bg-green-400/20"
                  }`}
                >
                  {key.isActive ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => deleteKey(key.id)}
                  className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-400/50 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {keys.length > 0 && (
        <div className="rounded-xl border border-white/5 bg-white/3 p-4 flex gap-3">
          <svg className="h-4 w-4 text-yellow-400/70 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-white/30 leading-relaxed">
            Keep API keys secret. Use them only in server-side code via the{" "}
            <code className="text-white/50 bg-white/5 rounded px-1 font-mono">x-api-key</code> header. Never expose in frontend JavaScript.
          </p>
        </div>
      )}
    </div>
  );
}
