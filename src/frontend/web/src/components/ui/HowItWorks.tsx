import type React from "react";
import { Layers, Search, Zap } from "lucide-react";
import { cn } from "../../lib/utils";
import "./HowItWorks.css";

type StepItem = {
  title: string;
  description: string;
  benefits: string[];
  icon?: React.ReactNode;
};

interface HowItWorksProps extends React.HTMLAttributes<HTMLDivElement> {
  steps?: StepItem[];
  title?: string;
  description?: string;
}

interface StepCardProps {
  step: StepItem;
}

function StepCard({ step }: StepCardProps) {
  return (
    <article className="sa-howItWorks__card">
      <div className="sa-howItWorks__iconWrap" aria-hidden="true">
        {step.icon}
      </div>
      <h3>{step.title}</h3>
      <p>{step.description}</p>
      <ul className="sa-howItWorks__benefits">
        {step.benefits.map((benefit) => (
          <li key={benefit}>
            <span className="sa-howItWorks__dot" aria-hidden="true" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

const defaultSteps: StepItem[] = [
  {
    icon: <Search />,
    title: "Set up the trip context",
    description:
      "Choose home and destination currencies before expenses start, so every entry stays traceable.",
    benefits: [
      "Home vs local currency context",
      "Trip-level accounting baseline",
      "Ready for exchange-rate tracking",
    ],
  },
  {
    icon: <Layers />,
    title: "Capture categorized expenses",
    description:
      "Log day-to-day spending by category and subcategory with notes that stay useful for reimbursement review.",
    benefits: [
      "Fast category-based capture",
      "Supports transport, food, tourism and more",
      "Keeps daily ledger detail organized",
    ],
  },
  {
    icon: <Zap />,
    title: "Review and export summaries",
    description:
      "See ledger totals, category breakdowns, and export CSV files for finance, bookkeeping, or personal records.",
    benefits: [
      "Ledger summary by day/category",
      "CSV export for reimbursements",
      "Multi-user-ready workflow direction",
    ],
  },
];

export function HowItWorks({
  className,
  steps = defaultSteps,
  title = "How it works",
  description = "Sacatucuenta organizes travel accounting into a simple workflow: set trip context, capture categorized spending, and export finance-ready summaries.",
  ...props
}: HowItWorksProps) {
  return (
    <div className={cn("sa-howItWorks", className)} {...props}>
      <header className="sa-howItWorks__header">
        <h3>{title}</h3>
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
          <StepCard key={step.title} step={step} />
        ))}
      </div>
    </div>
  );
}
