import { Link, Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { MACHINE_DETAILS, MACHINE_ORDER } from "../../data/machineDetails";

export default function MachinePage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const detail = MACHINE_DETAILS[slug];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (!detail) {
    return <Navigate to="/about" replace />;
  }

  // Pull translated content
  const data = t(`machinePages.${slug.replaceAll("-", "_")}`, { returnObjects: true });
  const specLabels = t("machinePages.specLabels", { returnObjects: true });
  const labels = t("machinePages.labels", { returnObjects: true });

  // Resolve next machine for navigation footer
  const idx = MACHINE_ORDER.indexOf(slug);
  const nextSlug = MACHINE_ORDER[(idx + 1) % MACHINE_ORDER.length];
  const nextName = t(`machinePages.${nextSlug.replaceAll("-", "_")}.name`);

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0">
          <img
            src={detail.hero_image}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-60"
            loading="eager"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/55 to-brand-dark/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/45 to-transparent" />
        </div>

        <div className="section-shell relative">
          <div className="grid min-h-[70vh] grid-cols-1 items-end py-20 lg:py-28">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <Link
                  to="/home#machines"
                  className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55 transition hover:text-brand-accent"
                >
                  ← {labels.back}
                </Link>
                <span className="text-[11px] uppercase tracking-[0.28em] text-white/35">
                  / {data.eyebrow}
                </span>
              </div>

              <h1 className="mt-6 text-5xl font-light leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                {data.name}
              </h1>

              <p className="mt-6 max-w-2xl text-lg font-medium text-brand-accent">
                {data.headline}
              </p>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/75">
                {data.description}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a href="#contact" className="primary-button">
                  {labels.requestQuote}
                </a>
                <a
                  href="#contact"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition hover:border-brand-accent hover:text-brand-accent"
                >
                  {labels.bookAsljunga} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT IS + FEATURES (2 column) */}
      <section className="bg-white py-20 sm:py-24">
        <div className="section-shell grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">
              {labels.whatItIs}
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-[-0.02em] text-brand-dark sm:text-4xl">
              {data.whatItIs.title}
            </h2>
            <p className="mt-6 text-base leading-8 text-brand-dark/72">
              {data.whatItIs.body}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">
              {labels.keyFeatures}
            </p>
            <ul className="mt-5 space-y-4">
              {data.features.map((f) => (
                <li
                  key={f}
                  className="flex gap-4 rounded-2xl border border-brand-dark/8 bg-brand-light p-4"
                >
                  <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-brand-accent" />
                  <span className="text-sm leading-7 text-brand-dark/82">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SPECS TABLE */}
      <section className="bg-brand-light py-20 sm:py-24">
        <div className="section-shell">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">
            {labels.specs}
          </p>
          <h2 className="mt-5 text-3xl font-light leading-tight tracking-[-0.02em] text-brand-dark sm:text-4xl">
            {labels.indicativeSpecs}
          </h2>

          <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-brand-dark/8 sm:grid-cols-2">
            {detail.spec_keys.map((k) => (
              <div key={k} className="bg-white p-5 sm:p-6">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-dark/55">
                  {specLabels[k] || k}
                </dt>
                <dd className="mt-2 text-base font-medium text-brand-dark">
                  {data.specs[k]}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 max-w-2xl text-xs leading-6 text-brand-dark/55">
            {labels.specCaveat}
          </p>
        </div>
      </section>

      {/* APPLICATIONS */}
      {data.applications && data.applications.length > 0 ? (
        <section className="bg-white py-20 sm:py-24">
          <div className="section-shell">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">
              {labels.applications}
            </p>
            <h2 className="mt-5 max-w-3xl text-3xl font-light leading-tight tracking-[-0.02em] text-brand-dark sm:text-4xl">
              {labels.applicationsTitle}
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {data.applications.map((a, i) => (
                <article
                  key={i}
                  className="rounded-2xl border border-brand-dark/8 bg-brand-light p-6"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-accent/12 text-xs font-semibold text-brand-accent">
                    0{i + 1}
                  </span>
                  <p className="mt-4 text-sm leading-7 text-brand-dark/82">{a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* GALLERY */}
      <section className="bg-brand-light py-20 sm:py-24">
        <div className="section-shell">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">
            {labels.gallery}
          </p>
          <h2 className="mt-5 text-3xl font-light leading-tight tracking-[-0.02em] text-brand-dark sm:text-4xl">
            {labels.galleryTitle}
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {detail.gallery.map((g, i) => (
              <figure
                key={g.src}
                className="overflow-hidden rounded-3xl border border-brand-dark/8 bg-white"
              >
                <img
                  src={g.src}
                  alt=""
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
                <figcaption className="px-5 py-3 text-xs text-brand-dark/55">
                  {t(`machinePages.${g.caption}`, "")}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FEFPEB CTA */}
      <section className="bg-brand-dark py-16 text-white sm:py-20">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">
                {labels.fefpebEyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-light tracking-[-0.02em] sm:text-3xl">
                {labels.fefpebTitle}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
                {labels.fefpebBody}
              </p>
            </div>
            <a href="#contact" id="contact" className="primary-button">
              {labels.fefpebCta}
            </a>
          </div>
        </div>
      </section>

      {/* NEXT MACHINE NAV */}
      <section className="bg-brand-light py-12 sm:py-16">
        <div className="section-shell">
          <Link
            to={`/machines/${nextSlug}`}
            className="group flex items-center justify-between rounded-3xl border border-brand-dark/8 bg-white p-6 sm:p-8 transition hover:border-brand-accent/30 hover:shadow-panel"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-dark/55">
                {labels.nextMachine}
              </p>
              <p className="mt-2 text-xl font-medium tracking-[-0.02em] text-brand-dark">
                {nextName}
              </p>
            </div>
            <span className="text-3xl text-brand-accent transition group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
