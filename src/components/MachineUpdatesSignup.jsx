import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MACHINE_INTEREST_OPTIONS, createLeadRecord, readDevelopmentLeads, writeDevelopmentLeads } from "../data/leads";

const initialForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  machineInterest: "",
  message: "",
  consent: false,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const interestTranslationKeys = {
  "Block Production Line": "blockProductionLine",
  Microdryer: "microdryer",
  "Nonstop & Topfoil Pallet": "nonstopTopfoilPallet",
  "CAPE machinery": "capeMachinery",
  "Private demonstration visit": "privateDemonstrationVisit",
  "FEFPEB / industry events": "industryEvents",
  "General equipment and solution updates": "generalUpdates",
};

function createFallbackMailto(lead) {
  const subject = encodeURIComponent(`Jointec updates signup - ${lead.company}`);
  const body = encodeURIComponent(
    [
      "Hello Jointec,",
      "",
      "A visitor tried to submit the website updates form, but the direct signup service was unavailable.",
      "",
      `Name: ${lead.name}`,
      `Company: ${lead.company}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone || ""}`,
      `Country: ${lead.country}`,
      `Solution interest: ${lead.machineInterest}`,
      `Source page: ${lead.sourcePage}`,
      `Message: ${lead.message || ""}`,
      "",
      "Consent: The visitor checked the updates consent box.",
    ].join("\n"),
  );

  return `mailto:info@jointec.se?subject=${subject}&body=${body}`;
}

export default function MachineUpdatesSignup({ sourcePage }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState({ status: "idle", message: "" });

  const page = useMemo(() => sourcePage || document.title || window.location.pathname, [sourcePage]);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.name.trim() || !form.company.trim() || !form.email.trim() || !form.country.trim() || !form.machineInterest) {
      return t("signup.validation.required");
    }
    if (!emailPattern.test(form.email.trim())) return t("signup.validation.email");
    if (!form.consent) return t("signup.validation.consent");
    return "";
  };

  const submit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setState({ status: "error", message: validationError });
      return;
    }

    const lead = createLeadRecord({ ...form, sourcePage: page });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!response.ok) throw new Error("Lead API unavailable");
    } catch (error) {
      if (!import.meta.env.DEV) {
        window.location.href = createFallbackMailto(lead);
        setState({
          status: "fallback",
          message: t("signup.messages.fallbackDetail"),
        });
        return;
      }

      // TODO: Replace development-only localStorage fallback with production CRM/database integration.
      const existing = readDevelopmentLeads();
      writeDevelopmentLeads([lead, ...existing]);
    }

    setForm(initialForm);
    setState({
      status: "success",
      message: t("signup.messages.successDetail"),
    });
  };

  return (
    <section id="machine-updates" className="scroll-mt-28 bg-white py-20 sm:py-24">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.44fr_0.56fr] lg:items-start">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">
            {t("signup.eyebrow")}
          </p>
          <h2 className="mt-5 text-4xl font-light leading-tight tracking-[-0.03em] text-brand-dark">
            {t("signup.heading")}
          </h2>
          <p className="mt-5 text-base leading-8 text-brand-dark/72">
            {t("signup.intro")}
          </p>
          <p className="mt-6 rounded-2xl border border-brand-dark/8 bg-brand-light p-4 text-sm font-medium text-brand-dark/72">
            {t("signup.note")}
          </p>
        </div>

        <form onSubmit={submit} className="rounded-[1.75rem] border border-brand-dark/8 bg-brand-light p-6 shadow-sm sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("signup.fields.name")} name="name" value={form.name} onChange={update} required />
            <Field label={t("signup.fields.company")} name="company" value={form.company} onChange={update} required />
            <Field label={t("signup.fields.email")} name="email" type="email" value={form.email} onChange={update} required />
            <Field label={t("signup.fields.phone")} name="phone" value={form.phone} onChange={update} />
            <Field label={t("signup.fields.country")} name="country" value={form.country} onChange={update} required />
            <label className="text-sm font-semibold text-brand-dark/72">
              {t("signup.fields.solutionInterest")} *
              <select
                name="machineInterest"
                value={form.machineInterest}
                onChange={update}
                required
                className="mt-2 h-12 w-full rounded-xl border border-brand-dark/10 bg-white px-4 text-sm text-brand-dark outline-none transition focus:border-brand-accent"
              >
                <option value="">{t("signup.placeholders.interest")}</option>
                {MACHINE_INTEREST_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {t(`signup.interests.${interestTranslationKeys[option]}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold text-brand-dark/72">
            {t("signup.fields.message")}
            <textarea
              name="message"
              value={form.message}
              onChange={update}
              rows={4}
              placeholder={t("signup.placeholders.message")}
              className="mt-2 w-full rounded-xl border border-brand-dark/10 bg-white px-4 py-3 text-sm text-brand-dark outline-none transition focus:border-brand-accent"
            />
          </label>

          <label className="mt-5 flex gap-3 text-sm leading-6 text-brand-dark/72">
            <input
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={update}
              required
              className="mt-1 h-4 w-4 shrink-0 accent-brand-accent"
            />
            <span>
              {t("signup.consent")}
            </span>
          </label>

          <p className="mt-4 text-xs leading-6 text-brand-dark/55">
            {t("signup.privacy")}
            {/* TODO: Add privacy policy page and link before launch. */}
          </p>

          {state.status !== "idle" ? (
            <div className={`mt-5 rounded-2xl p-4 text-sm leading-6 ${
              state.status === "success"
                ? "bg-emerald-50 text-emerald-900"
                : state.status === "fallback"
                  ? "bg-amber-50 text-amber-950"
                  : "bg-red-50 text-red-900"
            }`}>
              <p className="font-semibold">
                {state.status === "success"
                  ? t("signup.messages.successTitle")
                  : state.status === "fallback"
                    ? t("signup.messages.fallbackTitle")
                    : t("signup.messages.errorTitle")}
              </p>
              <p className="mt-1">{state.message}</p>
            </div>
          ) : null}

          <button type="submit" className="primary-button mt-6 w-full">
            {t("signup.button")}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <label className="text-sm font-semibold text-brand-dark/72">
      {label}{required ? " *" : ""}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-2 h-12 w-full rounded-xl border border-brand-dark/10 bg-white px-4 text-sm text-brand-dark outline-none transition focus:border-brand-accent"
      />
    </label>
  );
}
