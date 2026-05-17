import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";

function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/home";

  // Mix of in-page anchors (when on home) and full anchors (when on a sub-page)
  const machinesHref = isHome ? "#machines" : "/home#machines";
  const capeHref     = isHome ? "#cape"     : "/home#cape";
  const servicesHref = isHome ? "#services" : "/home#services";
  const contactHref  = isHome ? "#contact"  : "/home#contact";

  const navItems = [
    { label: t("navbar.machines"), href: machinesHref, kind: "anchor" },
    { label: t("navbar.cape"),     href: capeHref,     kind: "anchor" },
    { label: t("navbar.cases"),    to: "/cases" },
    { label: t("navbar.news"),     to: "/news" },
    { label: t("navbar.about"),    to: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-nav backdrop-blur-xl"
          : "bg-white/88 backdrop-blur-lg"
      }`}
    >
      <div className="section-shell flex items-center justify-between gap-4 py-4 sm:py-5">
        <Link
          to="/about"
          className="logo mr-2 inline-flex shrink-0 items-center sm:mr-4"
          aria-label={t("navbar.homeLabel")}
        >
          <Logo />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {navItems.map((item) =>
            item.to ? (
              <Link key={item.label} to={item.to} className="nav-link">
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} className="nav-link">
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />
          <a href={contactHref} className="primary-button px-5 py-2.5 text-xs">
            {t("navbar.cta")}
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-dark/10 text-brand-dark transition hover:border-brand-accent/40 hover:text-brand-accent lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={t("navbar.toggleNavigation")}
        >
          <span className="text-xl leading-none">{open ? "×" : "≡"}</span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-brand-dark/8 bg-white lg:hidden">
          <div className="section-shell flex flex-col gap-3 py-5">
            <LanguageSwitcher />
            {navItems.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className="nav-link w-fit"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="nav-link w-fit"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ),
            )}
            <a
              href={contactHref}
              className="primary-button w-full"
              onClick={() => setOpen(false)}
            >
              {t("navbar.cta")}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
