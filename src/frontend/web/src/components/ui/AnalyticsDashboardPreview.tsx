import { useMemo, useState } from "react";
import "./AnalyticsDashboardPreview.css";

type TabKey = "overview" | "analytics" | "reports";

const tabLabels: Array<{ key: TabKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "analytics", label: "Analytics" },
  { key: "reports", label: "Reports" },
];

export function AnalyticsDashboardPreview() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const progress = 75;
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  const metrics = useMemo(() => {
    if (activeTab === "analytics") {
      return [
        { label: "Page Views", value: "45,293", accent: true },
        { label: "Unique Visitors", value: "12,847" },
        { label: "Bounce Rate", value: "32.4%" },
        { label: "Avg Session", value: "3m 42s" },
      ];
    }

    if (activeTab === "reports") {
      return [
        { label: "Exports", value: "128", accent: true },
        { label: "Pending", value: "7" },
        { label: "Trips in review", value: "14" },
        { label: "Finance teams", value: "3" },
      ];
    }

    return [
      { label: "Today Spend (ARS)", value: "19,000", accent: true },
      { label: "Home Eq. (USD)", value: "13.82" },
      { label: "Entries", value: "6" },
      { label: "Categories", value: "3" },
    ];
  }, [activeTab]);

  const summaryRows = useMemo(() => {
    if (activeTab === "analytics") {
      return [
        { label: "Food & Drinks", value: "42%" },
        { label: "Transportation", value: "31%" },
        { label: "Tourism", value: "18%" },
        { label: "Other", value: "9%" },
      ];
    }

    if (activeTab === "reports") {
      return [
        { label: "Weekly Export", value: "Ready" },
        { label: "Month-end Pack", value: "In review" },
        { label: "CSV Template", value: "Latest" },
        { label: "Owner", value: "Finance Ops" },
      ];
    }

    return [
      { label: "Food & Drinks", value: "42%" },
      { label: "Transportation", value: "31%" },
      { label: "Tourism", value: "18%" },
      { label: "Snacks / Others", value: "9%" },
    ];
  }, [activeTab]);

  return (
    <div className="sa-analyticsDash" aria-hidden="true">
      <div className="sa-analyticsDash__toolbar">
        <div className="sa-analyticsDash__dots">
          <span />
          <span />
          <span />
        </div>
        <p className="sa-analyticsDash__title">Travel Accounting Dashboard</p>
        <div className="sa-analyticsDash__progressWrap">
          <div className="sa-analyticsDash__ring">
            <svg viewBox="0 0 40 40" aria-hidden="true">
              <defs>
                <linearGradient id="saAnalyticsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff8f47" />
                  <stop offset="100%" stopColor="#ff6a1c" />
                </linearGradient>
              </defs>
              <circle className="sa-analyticsDash__ringTrack" cx="20" cy="20" r={radius} />
              <circle
                className="sa-analyticsDash__ringValue"
                cx="20"
                cy="20"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <span className="sa-analyticsDash__ringLabel">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="sa-analyticsDash__shell">
        <aside className="sa-analyticsDash__sidebar">
          <div className="sa-analyticsDash__sidebarBrand" />
          <div className="sa-analyticsDash__sidebarItem sa-analyticsDash__sidebarItem--active" />
          <div className="sa-analyticsDash__sidebarItem" />
          <div className="sa-analyticsDash__sidebarItem" />
          <div className="sa-analyticsDash__sidebarItem" />
          <div className="sa-analyticsDash__sidebarItem" />
        </aside>

        <div className="sa-analyticsDash__main">
          <div className="sa-analyticsDash__headerRow">
            <div className="sa-analyticsDash__headerCopy">
              <h3>Travel Expense Analytics</h3>
              <p>Performance metrics and accounting-ready summaries at a glance.</p>
            </div>
            <div className="sa-analyticsDash__tabs" role="tablist" aria-label="Dashboard tabs">
              {tabLabels.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  className={
                    activeTab === tab.key
                      ? "sa-analyticsDash__tab sa-analyticsDash__tab--active"
                      : "sa-analyticsDash__tab"
                  }
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="sa-analyticsDash__metrics">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className={metric.accent ? "sa-analyticsDash__metric sa-analyticsDash__metric--accent" : "sa-analyticsDash__metric"}
              >
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>

          <div className="sa-analyticsDash__body">
            <section className="sa-analyticsDash__panel">
              <div className="sa-analyticsDash__panelHead">
                <div>
                  <h4>{activeTab === "reports" ? "Weekly Summary" : "Weekly Trend"}</h4>
                  <p>
                    {activeTab === "reports"
                      ? "Exports, reimbursements, and bookkeeping pipeline"
                      : "Travel + Food + Transport"}
                  </p>
                </div>
                <span className="sa-analyticsDash__chip">
                  {activeTab === "overview" ? "+12.5%" : activeTab === "analytics" ? "Live" : "Ready"}
                </span>
              </div>
              <div className="sa-analyticsDash__chart">
                <div className="sa-analyticsDash__chartGlow" />
                <div className="sa-analyticsDash__chartLine" />
                <div className="sa-analyticsDash__trendBars">
                  {[42, 58, 51, 74, 66, 81, 63].map((height, index) => (
                    <span key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
            </section>

            <section className="sa-analyticsDash__panel">
              <div className="sa-analyticsDash__panelHead">
                <div>
                  <h4>{activeTab === "reports" ? "Report Status" : "Top Categories"}</h4>
                  <p>
                    {activeTab === "reports"
                      ? "Current export and review progress"
                      : "Breakdown of spend by category"}
                  </p>
                </div>
              </div>
              <ul className="sa-analyticsDash__summaryList">
                {summaryRows.map((row) => (
                  <li key={row.label}>
                    <span>{row.label}</span>
                    <strong>{row.value}</strong>
                  </li>
                ))}
              </ul>
              <div className="sa-analyticsDash__summaryActions">
                <button type="button" className="sa-analyticsDash__button">
                  {activeTab === "reports" ? "Generate Report" : "Export CSV"}
                </button>
                <button type="button" className="sa-analyticsDash__button sa-analyticsDash__button--ghost">
                  View Details
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

