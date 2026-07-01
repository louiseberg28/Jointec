import { useEffect, useMemo, useState } from "react";
import { LEAD_STATUS_OPTIONS, MACHINE_INTEREST_OPTIONS, readDevelopmentLeads, writeDevelopmentLeads } from "../../data/leads";

const columns = ["Date", "Name", "Company", "Email", "Phone", "Country", "Machine Interest", "Source Page", "Status", "Message", "Notes"];

export default function AdminLeadsPage() {
  const [session, setSession] = useState({
    loading: true,
    authenticated: false,
    adminConfigured: false,
    databaseConfigured: false,
    missingDatabaseEnv: [],
    emailConfigured: false,
    apiUnavailable: false,
  });
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [leads, setLeads] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [interest, setInterest] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch("/api/admin/session");
      const data = await response.json();
      const next = { loading: false, ...data, apiUnavailable: false };
      setSession(next);
      if (next.authenticated) loadLeads();
    } catch {
      if (import.meta.env.DEV) {
        setSession({
          loading: false,
          authenticated: true,
          adminConfigured: false,
          databaseConfigured: false,
          missingDatabaseEnv: [],
          emailConfigured: false,
          apiUnavailable: true,
        });
        setLeads(readDevelopmentLeads());
        return;
      }

      setSession((current) => ({ ...current, loading: false, apiUnavailable: true }));
    }
  };

  const login = async (event) => {
    event.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Wrong password or admin login is not configured.");
      }

      setPassword("");
      await checkSession();
      await loadLeads();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Unable to log in.");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setSession((current) => ({ ...current, authenticated: false }));
    setLeads([]);
  };

  const loadLeads = async () => {
    setLoadError("");

    try {
      const response = await fetch("/api/admin/leads");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load leads.");
      }

      setLeads(data.leads || []);
    } catch (error) {
      if (import.meta.env.DEV) {
        setLeads(readDevelopmentLeads());
        return;
      }

      setLoadError(error instanceof Error ? error.message : "Unable to load leads.");
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return leads
      .filter((lead) => !q || [lead.name, lead.company, lead.email, lead.country].some((value) => value?.toLowerCase().includes(q)))
      .filter((lead) => !interest || lead.machineInterest === interest)
      .filter((lead) => !status || lead.status === status)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [leads, query, interest, status]);

  const updateLead = async (id, patch) => {
    const previous = leads;
    const next = leads.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead));
    setLeads(next);

    if (session.apiUnavailable) {
      writeDevelopmentLeads(next);
      return;
    }

    try {
      const response = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });

      if (!response.ok) throw new Error("Lead update failed.");
    } catch {
      setLeads(previous);
      setLoadError("Could not update the lead database. Please try again.");
    }
  };

  const exportCsv = () => {
    const headers = ["createdAt", "name", "company", "email", "phone", "country", "machineInterest", "sourcePage", "status", "message", "notes", "consent"];
    const rows = filtered.map((lead) => headers.map((key) => `"${String(lead[key] ?? "").replaceAll('"', '""')}"`).join(","));
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jointec-leads.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (session.loading) {
    return <AdminShell><p className="text-sm text-brand-dark/65">Checking admin session...</p></AdminShell>;
  }

  if (!session.authenticated && !session.apiUnavailable) {
    return (
      <AdminShell>
        <div className="mx-auto max-w-md rounded-3xl bg-white p-7 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">Owner login</p>
          <h1 className="mt-4 text-3xl font-light tracking-[-0.03em] text-brand-dark">Jointec Lead Database</h1>
          <p className="mt-3 text-sm leading-6 text-brand-dark/65">
            Enter the private admin password to view website leads.
          </p>

          {!session.adminConfigured ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              Admin login is not configured yet. Add `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`
              as environment variables in Cloudflare before production.
            </div>
          ) : null}

          <form onSubmit={login} className="mt-6">
            <label className="text-sm font-semibold text-brand-dark/72">
              Admin password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-brand-dark/10 px-4 text-sm outline-none focus:border-brand-accent"
                required
              />
            </label>
            {loginError ? <p className="mt-3 text-sm text-red-700">{loginError}</p> : null}
            <button type="submit" className="primary-button mt-5 w-full">Log In</button>
          </form>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="rounded-3xl bg-brand-dark p-7 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">Owner only</p>
            <h1 className="mt-4 text-4xl font-light tracking-[-0.03em]">Jointec Lead Database</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
              View, search, update and export contacts who signed up through the Jointec website.
            </p>
          </div>
          {!session.apiUnavailable ? (
            <button onClick={logout} className="rounded-full border border-white/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 transition hover:border-brand-accent hover:text-brand-accent">
              Log out
            </button>
          ) : null}
        </div>
      </div>

      <ConnectionStatus session={session} loadError={loadError} />

      <div className="mt-6 grid gap-3 rounded-3xl bg-white p-5 shadow-sm lg:grid-cols-[1fr_0.28fr_0.25fr_auto]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, company, email or country" className="h-11 rounded-xl border border-brand-dark/10 px-4 text-sm outline-none focus:border-brand-accent" />
        <select value={interest} onChange={(event) => setInterest(event.target.value)} className="h-11 rounded-xl border border-brand-dark/10 px-4 text-sm outline-none focus:border-brand-accent">
          <option value="">All interests</option>
          {MACHINE_INTEREST_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-xl border border-brand-dark/10 px-4 text-sm outline-none focus:border-brand-accent">
          <option value="">All statuses</option>
          {LEAD_STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <button onClick={exportCsv} className="primary-button h-11 px-5 py-2 text-xs">Export Leads CSV</button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="min-w-[1300px] text-left text-sm">
          <thead className="bg-brand-light text-[10px] uppercase tracking-[0.2em] text-brand-dark/55">
            <tr>{columns.map((column) => <th key={column} className="px-4 py-4 font-semibold">{column}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-t border-brand-dark/8 align-top">
                <td className="px-4 py-4">{lead.createdAt ? new Date(lead.createdAt).toLocaleString() : ""}</td>
                <td className="px-4 py-4 font-medium">{lead.name}</td>
                <td className="px-4 py-4">{lead.company}</td>
                <td className="px-4 py-4"><a href={`mailto:${lead.email}`} className="text-brand-accent">{lead.email}</a></td>
                <td className="px-4 py-4">{lead.phone}</td>
                <td className="px-4 py-4">{lead.country}</td>
                <td className="px-4 py-4">{lead.machineInterest}</td>
                <td className="px-4 py-4">{lead.sourcePage}</td>
                <td className="px-4 py-4">
                  <select value={lead.status} onChange={(event) => updateLead(lead.id, { status: event.target.value })} className="rounded-lg border border-brand-dark/10 px-2 py-1 text-xs">
                    {LEAD_STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </td>
                <td className="max-w-[240px] px-4 py-4 text-brand-dark/70">{lead.message}</td>
                <td className="px-4 py-4">
                  <textarea value={lead.notes} onChange={(event) => updateLead(lead.id, { notes: event.target.value })} className="h-20 w-56 rounded-lg border border-brand-dark/10 p-2 text-xs" />
                </td>
              </tr>
            ))}
            {!filtered.length ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-brand-dark/55">
                  No leads found yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function AdminShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 p-5 text-brand-dark sm:p-8">
      <div className="mx-auto max-w-[1500px]">{children}</div>
    </div>
  );
}

function ConnectionStatus({ session, loadError }) {
  if (session.apiUnavailable) {
    return (
      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <p className="font-semibold">Local preview mode</p>
        <p className="mt-2">
          This Vite preview cannot run Cloudflare Pages Functions, so it shows test leads stored in this
          browser. After deployment, this page requires the private admin password and reads from
          the Cloudflare lead database.
        </p>
      </div>
    );
  }

  if (loadError || !session.databaseConfigured) {
    return (
      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <p className="font-semibold">Lead database still needs configuration</p>
        <p className="mt-2">
          Admin login is active, but leads cannot be stored until this Cloudflare D1 binding is set:
          {" "}{(session.missingDatabaseEnv || []).join(", ") || "JOINTEC_DB"}.
        </p>
        {!session.emailConfigured ? (
          <p className="mt-2">Email sending also needs `RESEND_API_KEY` before automatic emails are sent.</p>
        ) : null}
        {loadError ? <p className="mt-2">Current error: {loadError}</p> : null}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
      <p className="font-semibold">Connected to the lead database</p>
      <p className="mt-2">
        Website form submissions are stored in Cloudflare D1. This admin page reads the same database
        and can update lead status and notes. CSV export can be opened in Excel.
      </p>
      {!session.emailConfigured ? (
        <p className="mt-2">Email sending is not active yet. Add `RESEND_API_KEY` in Cloudflare to send automatic emails.</p>
      ) : null}
    </div>
  );
}
