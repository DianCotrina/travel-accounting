import type React from "react";
import { Layers, Search, Zap } from "lucide-react";
import { cn } from "../../lib/utils";
import "./HowItWorks.css";

type StepItem = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

interface HowItWorksProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  steps?: StepItem[];
  title?: string;
  description?: string;
}

const defaultSteps: StepItem[] = [
  {
    icon: <Search />,
    title: "Set up trip context",
    description:
      "Choose home and destination currencies before expenses start, so every entry stays traceable.",
  },
  {
    icon: <Layers />,
    title: "Capture categorized expenses",
    description:
      "Log day-to-day spending by category with notes that stay useful for reimbursement review.",
  },
  {
    icon: <Zap />,
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
          <p className="sa-kicker">Simple workflow</p>
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
              <div className="sa-howItWorks__iconWrap" aria-hidden="true">
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
