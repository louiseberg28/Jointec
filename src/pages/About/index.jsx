import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function AboutPage() {
  const { t } = useTranslation();
  const story = t("aboutPage.story", { returnObjects: true });
  const numbers = t("aboutPage.numbers", { returnObjects: true });
  const principles = t("aboutPage.principles", { returnObjects: true });
  const team = t("aboutPage.team", { returnObjects: true });
  const labels = t("aboutPage.labels", { returnObjects: true });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0">
          <img
            src="/images/hero_factory_winter.webp"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-55"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/55 to-brand-dark/95" />
        </div>

        <div className="section-shell relative">
          <div className="grid min-h-[65vh] grid-cols-1 items-end py-20 lg:py-28">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">
                {t("aboutPage.eyebrow")}
              </p>
              <h1 className="mt-6 text-5xl font-light leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                {t("aboutPage.title")}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                {t("aboutPage.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers band */}
      <section className="bg-white">
        <div className="section-shell">
          <dl className="grid grid-cols-2 gap-px overflow-hidden border-y border-brand-dark/8 lg:grid-cols-4">
            {numbers.map((n) => (
              <div key={n.label} className="bg-white px-6 py-10 text-center">
                <dd className="text-4xl font-light tracking-[-0.02em] text-brand-accent sm:text-5xl">
                  {n.value}
                </dd>
                <dt className="mt-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-dark/55">
                  {n.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20 sm:py-28">
        <div className="section-shell grid gap-16 lg:grid-cols-[0.4fr_0.6fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">
              {labels.storyLabel}
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-[-0.02em] text-brand-dark sm:text-4xl">
              {labels.storyTitle}
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-brand-dark/78">
            {story.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-brand-light py-20 sm:py-24">
        <div className="section-shell">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">
            {labels.principlesLabel}
          </p>
          <h2 className="mt-5 max-w-3xl text-3xl font-light leading-tight tracking-[-0.02em] text-brand-dark sm:text-4xl">
            {labels.principlesTitle}
          </h2>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <article
                key={p.title}
                className="rounded-2xl border border-brand-dark/8 bg-white p-6"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-accent/12 text-xs font-semibold text-brand-accent">
                  0{i + 1}
                </span>
                <h3 className="mt-6 text-base font-semibold leading-tight tracking-[-0.01em] text-brand-dark">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-brand-dark/70">
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-20 sm:py-24">
        <div className="section-shell">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent">
            {labels.teamLabel}
          </p>
          <h2 className="mt-5 max-w-3xl text-3xl font-light leading-tight tracking-[-0.02em] text-brand-dark sm:text-4xl">
            {labels.teamTitle}
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((person) => (
              <div
                key={person.name}
                className="rounded-2xl border border-brand-dark/8 bg-brand-light p-6"
              >
                <div className="flex items-center justify-center text-4xl text-brand-dark/15">
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-dark text-base font-semibold text-white">
                    {person.initials}
                  </span>
                </div>
                <p className="mt-5 text-center text-lg font-medium text-brand-dark">
                  {person.name}
                </p>
                <p className="mt-1 text-center text-[11px] uppercase tracking-[0.22em] text-brand-accent">
                  {person.role}
                </p>
                {person.contact ? (
                  <p className="mt-3 text-center text-xs text-brand-dark/60">
                    <a href={`mailto:${person.contact}`} className="hover:text-brand-accent">
                      {person.contact}
                    </a>
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
