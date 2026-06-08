"use client";

import { useState } from "react";
import TdcLogo from "@/components/TdcLogo";
import FaqAccordion from "@/components/FaqAccordion";
import LoginForm from "@/components/LoginForm";

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Client Ingestion",
    description:
      "Premium client profiles are onboarded with comprehensive biodata — career, values, lifestyle preferences, and family context — forming a rich foundation for matching.",
  },
  {
    step: "02",
    title: "Algorithmic Scoring",
    description:
      "Our gender-aware engine evaluates up to 100 compatibility points across age, income, religion, diet, relocation, and more — grounded in Indian matrimonial research.",
  },
  {
    step: "03",
    title: "AI-Assisted Proposal Packaging",
    description:
      "Matchmakers review ranked candidates, generate warm AI compatibility notes, and send curated proposals — blending human judgment with intelligent automation.",
  },
];

export default function LandingPage() {
  const [portalOpen, setPortalOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[var(--tdc-bg)]">
      {/* Frosted glass navbar */}
      <header className="sticky top-0 z-40 border-b border-white/20 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <TdcLogo size={28} />
            <span className="text-sm font-semibold tracking-tight text-[var(--tdc-text)]">
              The Date Crew
            </span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => scrollTo("about")}
              className="text-sm font-medium text-[var(--tdc-muted)] transition hover:text-[var(--tdc-text)]"
            >
              About
            </button>
            <button
              onClick={() => scrollTo("methodology")}
              className="text-sm font-medium text-[var(--tdc-muted)] transition hover:text-[var(--tdc-text)]"
            >
              Methodology
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className="text-sm font-medium text-[var(--tdc-muted)] transition hover:text-[var(--tdc-text)]"
            >
              FAQ
            </button>
          </nav>

          <button
            onClick={() => setPortalOpen(true)}
            className="rounded-full bg-[var(--tdc-text)] px-5 py-2 text-sm font-medium text-white transition hover:bg-black"
          >
            Matchmaker Portal
          </button>
        </div>
      </header>

      {/* Hero */}
      <section id="about" className="px-6 pb-20 pt-24 md:pb-32 md:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--tdc-rose)]">
            Premium Matchmaking Intelligence
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--tdc-text)] md:text-5xl lg:text-6xl">
            Human-Centric Matchmaking
            <br />
            <span className="text-[var(--tdc-rose)]">Powered by Intelligence</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--tdc-muted)]">
            The Date Crew optimizes compatibility across careers, values, and lifestyle
            preferences — giving expert matchmakers the tools to find meaningful connections
            with confidence and care.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => setPortalOpen(true)}
              className="rounded-full bg-[var(--tdc-rose)] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--tdc-rose)]/20 transition hover:bg-[var(--tdc-rose-dark)]"
            >
              Enter Matchmaker Portal
            </button>
            <button
              onClick={() => scrollTo("methodology")}
              className="rounded-full border border-[var(--tdc-border)] bg-white px-8 py-3 text-sm font-semibold text-[var(--tdc-text)] transition hover:border-gray-300 hover:shadow-md"
            >
              See how it works
            </button>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="methodology" className="border-y border-[var(--tdc-border)] bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-[var(--tdc-text)]">How it works</h2>
            <p className="mt-3 text-[var(--tdc-muted)]">
              A streamlined workflow from client onboarding to curated proposals
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {WORKFLOW_STEPS.map((item) => (
              <div
                key={item.step}
                className="group rounded-2xl border border-[var(--tdc-border)] bg-[var(--tdc-bg)] p-8 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
              >
                <span className="text-3xl font-bold text-[var(--tdc-rose-light)] transition-colors group-hover:text-[var(--tdc-rose)]">
                  {item.step}
                </span>
                <h3 className="mt-4 text-xl font-bold text-[var(--tdc-text)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--tdc-muted)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-[var(--tdc-text)]">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-[var(--tdc-muted)]">
              Security, compliance, and platform capabilities
            </p>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--tdc-border)] bg-white/60 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <TdcLogo size={24} />
                <span className="font-semibold text-[var(--tdc-text)]">The Date Crew</span>
              </div>
              <p className="mt-3 max-w-sm text-sm text-[var(--tdc-muted)]">
                Internal matchmaking operations platform. For authorized personnel only.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--tdc-muted)]">
                Legal
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--tdc-muted)]">
                <li>
                  <a href="#" className="transition hover:text-[var(--tdc-text)]">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-[var(--tdc-text)]">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-[var(--tdc-text)]">
                    Data Processing Agreement
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--tdc-muted)]">
                Operations
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--tdc-muted)]">
                <li>System status: Operational</li>
                <li>API latency: Normal</li>
                <li>Last deployment: Active</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-[var(--tdc-border)] pt-6 text-center text-xs text-[var(--tdc-muted)]">
            © {new Date().getFullYear()} The Date Crew. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Portal login modal */}
      {portalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setPortalOpen(false)}
        >
          <div
            className="relative w-full max-w-md animate-fade-in rounded-2xl border border-[var(--tdc-border)] bg-[var(--tdc-surface)] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPortalOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--tdc-muted)] transition hover:bg-[var(--tdc-bg)] hover:text-[var(--tdc-text)]"
              aria-label="Close"
            >
              ×
            </button>
            <LoginForm compact onSuccess={() => setPortalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
