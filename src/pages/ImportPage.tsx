import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  formatCurrency,
  formatDateTime,
  formatOdds,
  formatStatus,
  importShareLink,
  type ImportShareLinkResponse,
} from "../lib/api";
import { Toast } from "../components/Toast";

const sampleHighlights = [
  "Import shared bets in seconds",
  "Build a personal betting history",
  "Spot patterns by market, player, and slip type",
];

export function ImportPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportShareLinkResponse | null>(null);
  const [showToast, setShowToast] = useState(false);

  const resultSummary = useMemo(() => {
    if (!result?.parsedBet) return null;

    return {
      legCount: result.parsedBet.legs.length,
      stake: result.parsedBet.stake,
      payout: result.parsedBet.payout,
      placedAt: result.parsedBet.placedAt,
      status: result.parsedBet.status,
      betType: result.parsedBet.betType,
      legs: result.parsedBet.legs,
    };
  }, [result]);

  useEffect(() => {
    if (!result?.betId) return;

    setShowToast(true);
    const timer = window.setTimeout(() => setShowToast(false), 2500);

    return () => window.clearTimeout(timer);
  }, [result?.betId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await importShareLink(url);
      setResult(data);
      setUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      {showToast ? <Toast message="Bet imported successfully." /> : null}

      <section className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">Betting intelligence, organized</p>
          <h1 className="hero__title">Turn shared bet slips into a real betting record.</h1>
          <p className="hero__subtitle">
            Cachet helps you import bets, preserve context, and build toward the
            trends that actually matter.
          </p>

          <div className="hero__actions">
            <a href="#import-form" className="button">
              Import a Bet
            </a>
            <Link to="/bets" className="button button--secondary">
              View Bets
            </Link>
          </div>

          <div className="hero__highlights">
            {sampleHighlights.map((item) => (
              <div key={item} className="hero__highlight">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="stack">
        <section id="import-form" className="card card--accent">
          <div className="section-heading">
            <h2 className="card__title">Import a shared bet</h2>
            <p className="muted">
              Paste a DraftKings or FanDuel share link to bring the slip into Cachet.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form-card">
            <input
              className="input"
              type="url"
              placeholder="Paste a DraftKings or FanDuel share link"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />

            <button className="button" type="submit" disabled={loading}>
              {loading ? "Importing..." : "Import Bet"}
            </button>
          </form>

          {error ? <p className="error-text">{error}</p> : null}
        </section>

        {result ? (
          <section className="card">
            <div className="section-heading">
              <h2 className="card__title">Import Result</h2>
              <div className="badge-row">
                <span className="badge">{result.sportsbook}</span>
                <span className="badge badge--accent">{result.status}</span>
              </div>
            </div>

            <div className="kv-list">
              <p>
                <strong>Import ID:</strong> {result.importId}
              </p>

              {result.betId ? (
                <p>
                  <strong>Bet ID:</strong>{" "}
                  <Link to={`/bets/${result.betId}`}>{result.betId}</Link>
                </p>
              ) : null}

              {result.message ? <p className="muted">{result.message}</p> : null}
            </div>

            {resultSummary ? (
              <>
                <div className="stats-grid stats-grid--compact">
                  <article className="card stat-card">
                    <p className="stat-card__label">Bet Type</p>
                    <p className="stat-card__value stat-card__value--sm">
                      {resultSummary.betType}
                    </p>
                  </article>

                  <article className="card stat-card">
                    <p className="stat-card__label">Status</p>
                    <p className="stat-card__value stat-card__value--sm">
                      {formatStatus(resultSummary.status)}
                    </p>
                  </article>

                  <article className="card stat-card">
                    <p className="stat-card__label">Stake</p>
                    <p className="stat-card__value stat-card__value--sm">
                      {formatCurrency(resultSummary.stake)}
                    </p>
                  </article>

                  <article className="card stat-card stat-card--accent">
                    <p className="stat-card__label">Payout</p>
                    <p className="stat-card__value stat-card__value--sm">
                      {formatCurrency(resultSummary.payout)}
                    </p>
                  </article>
                </div>

                <p className="muted">
                  Imported bet placed {formatDateTime(resultSummary.placedAt)}.
                </p>

                <div className="leg-card-grid">
                  {resultSummary.legs.map((leg, index) => (
                    <article key={`${leg.eventName}-${index}`} className="leg-card">
                      <p className="leg-card__eyebrow">
                        Leg {index + 1}
                      </p>
                      <h3 className="leg-card__title">
                        {leg.eventName ?? "Unknown Event"}
                      </h3>
                      <p className="leg-card__meta">
                        {leg.marketSubtype ?? "Unknown Market"} —{" "}
                        {leg.selectionType ?? "Unknown Selection"}
                      </p>
                      <p className="leg-card__odds">
                        Odds: {formatOdds(leg.oddsAmerican)}
                      </p>
                    </article>
                  ))}
                </div>
              </>
            ) : null}
          </section>
        ) : null}
      </div>
    </main>
  );
}