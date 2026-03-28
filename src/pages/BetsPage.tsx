import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listBets } from "../lib/api";

export function BetsPage() {
  const query = useQuery({
    queryKey: ["bets"],
    queryFn: () => listBets(25),
  });

  return (
    <main className="page">
      <div className="page__header">
        <h1 className="page__title">Bets</h1>
        <p className="page__subtitle">
          Review imported bets and open full details for each slip.
        </p>
      </div>

      {query.isLoading ? <p className="muted">Loading bets...</p> : null}
      {query.isError ? (
        <p className="error-text">Failed to load bets.</p>
      ) : null}

      <div className="bet-list">
        {query.data?.bets.map((bet) => (
          <article key={bet.id} className="card">
            <div className="bet-card__top">
              <div className="bet-card__meta">
                <div className="badge-row">
                  <span className="badge">{bet.sportsbook ?? "unknown"}</span>
                  <span className="badge">{bet.betType}</span>
                  <span className="badge badge--accent">{bet.status}</span>
                </div>

                <p>
                  <strong>Stake:</strong> {bet.stake ?? "—"}
                </p>
                <p>
                  <strong>Payout:</strong> {bet.payout ?? "—"}
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
    </main>
  );
}