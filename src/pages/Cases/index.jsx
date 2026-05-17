import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function CasesPage() {
  const { t } = useTranslation();
  const featured = t("casesPage.featured", { returnObjects: true });
  const more = t("casesPage.more", { returnObjects: true });
  const labels = t("casesPage.labels", { returnObjects: true });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark">
      <Navbar />

      {/* Page hero */}
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0">
          <img
            src="/images/klots_warehouse.webp"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-50"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/75 via-brand-dark/55 to-brand-dark/95" />
        </div>

        <div className="section-shell relative">
          <div className="grid min-h-[55vh] grid-cols-1 items-center py-20 lg:py-28">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">
                {t("casesPage.eyebrow")}
              </p>
              <h1 className="mt-6 text-5xl font-light leading-[1.02] tracking-[-0.035em] sm:text-6xl">
                {t("casesPage.title")}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                {t("casesPage.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured case */}
      <section className="bg-white py-20 sm:py-28">
        <div className="section-shell">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">
            {labels.featuredLabel}
          </p>
          <article className="mt-8 overflow-hidden rounded-[2rem] border border-brand-dark/8 bg-brand-light">
            <div className="grid gap-px lg:grid-cols-[1.1fr_1fr]">
              <div className="aspect-[4/3] overflow-hidden bg-brand-dark lg:aspect-auto">
                <img
                  src={featured.image}
                  alt={featured.customer}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="bg-brand-light p-8 sm:p-12">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
                  {featured.customer}
                </p>
                <h2 className="mt-4 text-3xl font-light leading-tight tracking-[-0.02em] text-brand-dark sm:text-4xl">
                  {featured.headline}
                </h2>
                <p className="mt-5 text-sm leading-7 text-brand-dark/72">
                  {featured.summary}
                </p>

                <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-brand-dark/8 pt-6">
                  {featured.numbers.map((n) => (
                    <div key={n.label}>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-dark/55">
                        {n.label}
                      </dt>
                      <dd className="mt-1 text-2xl font-light text-brand-accent">
                        {n.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-8 border-l-2 border-brand-accent pl-5 text-sm italic leading-7 text-brand-dark/82">
                  &ldquo;{featured.quote}&rdquo;
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-brand-dark/55">
                  {featured.quoteAttribution}
                </p>
              </div>
            </div>
          </article>

          {/* Three columns: challenge, solution, result */}
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {["challenge", "solution", "result"].map((key) => (
              <div
                key={key}
                className="rounded-2xl border border-brand-dark/8 bg-brand-light p-6"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
                  {labels[key]}
                </p>
                <p className="mt-3 text-sm leading-7 text-brand-dark/82">
                  {featured[key]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More installations */}
      <section className="bg-brand-light py-20 sm:py-28">
        <div className="section-shell">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">
            {labels.moreLabel}
          </p>
          <h2 className="mt-5 max-w-3xl text-3xl font-light leading-tight tracking-[-0.02em] text-brand-dark sm:text-4xl">
            {labels.moreTitle}
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {more.map((c, i) => (
              <article
                key={i}
                className="flex h-full flex-col rounded-2xl border border-brand-dark/8 bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-7 items-center rounded-full bg-brand-accent/12 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-accent">
                    {c.country}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-brand-dark/45">
                    {c.year}
                  </span>
                </div>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-dark/55">
                  {c.industry}
                </p>
                <h3 className="mt-2 text-lg font-medium tracking-[-0.01em] text-brand-dark">
                  {c.headline}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-brand-dark/70">
                  {c.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-brand-dark/8 pt-4">
                  {c.machines.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-brand-light px-2.5 py-1 text-[10px] font-semibold tracking-wider text-brand-dark/72 ring-1 ring-brand-dark/10"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-brand-dark py-16 text-white sm:py-20">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">
                {labels.ctaEyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-light tracking-[-0.02em] sm:text-3xl">
                {labels.ctaTitle}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
                {labels.ctaBody}
              </p>
            </div>
            <Link to="/home#contact" className="primary-button">
              {labels.ctaButton}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
