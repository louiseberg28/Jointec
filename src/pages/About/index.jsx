import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import ProcessVideo from "../../components/ProcessVideo";

export default function AboutPage() {
  const { t } = useTranslation();
  const story = t("aboutPage.story", { returnObjects: true });
  const labels = t("aboutPage.labels", { returnObjects: true });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark">
      <Navbar />
      <ProcessVideo />

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0">
          <img
            src="/images/about_pallet_stacks.jpg"
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
