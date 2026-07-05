"use client";

import { useResolvedLanding } from "@/lib/use-landing";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const { landing } = useResolvedLanding();
  const faq = landing.faq;
  if (!faq?.length) return null;

  return (
    <section className="px-6 py-28 border-t border-brand-border">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl mb-12">
          Frequently asked questions
        </h2>

        <div className="space-y-3">
          {faq.map((item, i) => (
            <FaqAccordionItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqAccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-xl border border-brand-border bg-brand-surface-card transition-all hover:border-brand-border-hover">
      <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-base font-medium list-none">
        {question}
        <ChevronDown className="h-4 w-4 text-[var(--brand-fg-faint)] transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-6 pb-5 text-sm leading-relaxed text-[var(--brand-fg-muted)]">
        {answer}
      </div>
    </details>
  );
}
