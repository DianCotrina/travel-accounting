import type { ReactNode } from "react";

type EmptyStateProps = { title: string; body: string; action?: ReactNode };

/** An invitation to act, not an apology. */
export function EmptyState({ title, body, action }: EmptyStateProps) {
  return (
    <div className="sa-empty">
      <p className="sa-empty__title">{title}</p>
      <p className="sa-empty__body">{body}</p>
      {action}
    </div>
  );
}
