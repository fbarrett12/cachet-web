import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { formatCurrency, formatDateTime, listBets } from "../lib/api";

export function BetsPage() {
  const query = useQuery({
    queryKey: ["bets"],
    queryFn: () => listBets(25),
  });

  const bets = query.data?.bets ?? [];

  const totalStake = bets.reduce((sum, bet) => sum + (bet.stake ?? 0), 0);
  const totalPayout = bets.reduce((sum, bet) => sum + (bet.payout ?? 0), 0);
  const wonCount = bets.filter((bet) => bet.status === "won").length;

  return (
    <main className="page">
      <div className="page__header">
        <h1 className="page__title">Bets</h1>
        <p className="page__subtitle">
          Review imported bets and open full details for each slip.
        </p>
      </div>

      {query.isLoading ? (
        <div className="card">
          <p className="muted">Loading bets...</p>
        </div>
      ) : null}

      {query.isError ? (
        <div className="card">
          <p className="error-text">Failed to load bets.</p>
        </div>
      ) : null}

      {!query.isLoading && !query.isError ? (
        <>
          <section className="stats-grid">
            <article className="card stat-card">
              <p className="stat-card__label">Imported Bets</p>
              <p className="stat-card__value">{bets.length}</p>
            </article>

            <article className="card stat-card">
              <p className="stat-card__label">Total Stake</p>
              <p className="stat-card__value">{formatCurrency(totalStake)}</p>
            </article>

            <article className="card stat-card">
              <p className="stat-card__label">Total Payout</p>
              <p className="stat-card__value">{formatCurrency(totalPayout)}</p>
            </article>

            <article className="card stat-card stat-card--accent">
              <p className="stat-card__label">Won Bets</p>
              <p className="stat-card__value">{wonCount}</p>
            </article>
          </section>

          {bets.length === 0 ? (
            <section className="card empty-state">
              <h2 className="card__title">No bets yet</h2>
              <p className="muted">
                Import your first shared bet to start building your Cachet history.
              </p>
              <div>
                <Link to="/">Go to Import</Link>
              </div>
            </section>
          ) : (
            <div className="bet-list">
              {bets.map((bet) => (
                <article key={bet.id} className="card">
                  <div className="bet-card__top">
                    <div className="bet-card__meta">
                      <div className="badge-row">
                        <span className="badge">{bet.sportsbook ?? "unknown"}</span>
                        <span className="badge">{bet.betType}</span>
                        <span className="badge badge--accent">{bet.status}</span>
                      </div>

                      <p>
                        <strong>Placed:</strong> {formatDateTime(bet.placedAt)}
                      </p>
                      <p>
                        <strong>Stake:</strong> {formatCurrency(bet.stake)}
                      </p>
                      <p>
                        <strong>Payout:</strong> {formatCurrency(bet.payout)}
                      </p>
                      <p>
                        <strong>Legs:</strong> {bet.legCount}
                      </p>
                    </div>

                    <div>
                      <Link to={`/bets/${bet.id}`}>Open Bet</Link>
                    </div>
                  </div>

                  {bet.legsPreview?.length ? (
                    <ul className="legs-list">
                      {bet.legsPreview.map((leg) => (
                        <li key={leg.id}>
                          {leg.eventName} — {leg.marketSubtype} — {leg.selectionType}
                          {leg.oddsAmerican != null ? ` (${leg.oddsAmerican})` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </>
      ) : null}
    </main>
  );
}