import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { formatCurrency, formatDateTime, getBetById } from "../lib/api";

export function BetDetailPage() {
  const { betId } = useParams();

  const query = useQuery({
    queryKey: ["bet", betId],
    queryFn: () => getBetById(betId as string),
    enabled: Boolean(betId),
  });

  const bet = query.data?.bet;

  return (
    <main className="page">
      <div className="page__header">
        <h1 className="page__title">Bet Detail</h1>
        <p className="page__subtitle">
          Inspect the imported slip and each leg stored in Cachet.
        </p>
      </div>

      {query.isLoading ? (
        <div className="card">
          <p className="muted">Loading bet...</p>
        </div>
      ) : null}

      {query.isError ? (
        <div className="card">
          <p className="error-text">Failed to load bet.</p>
        </div>
      ) : null}

      {bet ? (
        <div className="detail-grid">
          <section className="card">
            <h2 className="card__title">Bet Summary</h2>

            <div className="badge-row">
              <span className="badge">{bet.sportsbook ?? "unknown"}</span>
              <span className="badge">{bet.betType}</span>
              <span className="badge badge--accent">{bet.status}</span>
            </div>

            <div className="kv-list">
              <p>
                <strong>ID:</strong> {bet.id}
              </p>
              <p>
                <strong>Placed At:</strong> {formatDateTime(bet.placedAt)}
              </p>
              <p>
                <strong>Stake:</strong> {formatCurrency(bet.stake)}
              </p>
              <p>
                <strong>Potential Return:</strong> {formatCurrency(bet.toWin)}
              </p>
              <p>
                <strong>Payout:</strong> {formatCurrency(bet.payout)}
              </p>
              <p>
                <strong>External Bet ID:</strong> {bet.externalBetId ?? "—"}
              </p>
            </div>
          </section>

          <section className="card card--accent">
            <h2 className="card__title">Legs</h2>

            <ul className="legs-list">
              {bet.legs?.map((leg) => (
                <li key={leg.id}>
                  <div>
                    <strong>{leg.eventName ?? "Unknown Event"}</strong>
                  </div>
                  <div>
                    {leg.marketSubtype ?? "Unknown Market"} —{" "}
                    {leg.selectionType ?? "Unknown Selection"}
                  </div>
                  <div>
                    {leg.oddsAmerican != null
                      ? `Odds: ${leg.oddsAmerican}`
                      : "Odds: —"}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}
    </main>
  );
}