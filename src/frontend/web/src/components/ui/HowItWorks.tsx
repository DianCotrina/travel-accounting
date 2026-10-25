import type React from "react";
import { cn } from "../../lib/utils";
import "./HowItWorks.css";

type StepItem = {
  title: string;
  description: string;
};

interface HowItWorksProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  steps: StepItem[];
  title: string;
  description: string;
}

export function HowItWorks({
  className,
  id = "how-it-works",
  steps,
  title,
  description,
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
