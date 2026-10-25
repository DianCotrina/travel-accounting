import type React from "react";
import { cn } from "../../lib/utils";
import "./HowItWorks.css";

type StepItem = {
  title: string;
  description: string;
};

interface HowItWorksProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  steps?: StepItem[];
  title?: string;
  description?: string;
}

const defaultSteps: StepItem[] = [
  {
    title: "Set up trip context",
    description:
      "Choose home and destination currencies before expenses start, so every entry stays traceable.",
  },
  {
    title: "Capture categorized expenses",
    description:
      "Log day-to-day spending by category with notes that stay useful for reimbursement review.",
  },
  {
    title: "Review and export",
    description:
      "See ledger totals, category breakdowns, and export CSV files for finance or bookkeeping.",
  },
];

export function HowItWorks({
  className,
  id = "how-it-works",
  steps = defaultSteps,
  title = "How it works",
  description = "Sacatucuenta organizes travel accounting into a simple workflow: set trip context, capture categorized spending, and export finance-ready summaries.",
  ...props
}: HowItWorksProps) {
  return (
    <section id={id} className={cn("sa-howItWorks", className)} {...props}>
      <div className="sa-section-inner">
        <header className="sa-howItWorks__header">
          <h2>{title}</h2>
          <p>{description}</p>
        </header>

        <div className="sa-howItWorks__indicators" aria-hidden="true">
          <div className="sa-howItWorks__line" />
          <div className="sa-howItWorks__numbers">
            {steps.map((_, index) => (
              <div key={index} className="sa-howItWorks__number">
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="sa-howItWorks__grid">
          {steps.map((step) => (
            <article key={step.title} className="sa-howItWorks__card">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
