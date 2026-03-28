import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  formatCurrency,
  formatDateTime,
  formatOdds,
  formatStatus,
  getBetById,
} from "../lib/api";
import { LoadingCard } from "../components/LoadingCard";

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
        <div className="detail-grid">
          <LoadingCard lines={5} />
          <LoadingCard lines={5} />
        </div>
      ) : null}

      {query.isError ? (
        <div className="card">
          <p className="error-text">Failed to load bet.</p>
        </div>
      ) : null}

      {bet ? (
        <div className="stack">
          <section className="card">
            <h2 className="card__title">Bet Summary</h2>

            <div className="badge-row">
              <span className="badge">{bet.sportsbook ?? "unknown"}</span>
              <span className="badge">{bet.betType}</span>
              <span className="badge badge--accent">{formatStatus(bet.status)}</span>
            </div>

            <div className="stats-grid stats-grid--compact">
              <article className="card stat-card">
                <p className="stat-card__label">Stake</p>
                <p className="stat-card__value stat-card__value--sm">
                  {formatCurrency(bet.stake)}
                </p>
              </article>

              <article className="card stat-card">
                <p className="stat-card__label">Potential Return</p>
                <p className="stat-card__value stat-card__value--sm">
                  {formatCurrency(bet.toWin)}
                </p>
              </article>

              <article className="card stat-card">
                <p className="stat-card__label">Payout</p>
                <p className="stat-card__value stat-card__value--sm">
                  {formatCurrency(bet.payout)}
                </p>
              </article>

              <article className="card stat-card stat-card--accent">
                <p className="stat-card__label">Legs</p>
                <p className="stat-card__value">{bet.legs?.length ?? 0}</p>
              </article>
            </div>

            <div className="kv-list">
              <p>
                <strong>ID:</strong> {bet.id}
              </p>
              <p>
                <strong>Placed At:</strong> {formatDateTime(bet.placedAt)}
              </p>
              <p>
                <strong>External Bet ID:</strong> {bet.externalBetId ?? "—"}
              </p>
            </div>
          </section>

          <section className="card card--accent">
            <h2 className="card__title">Legs</h2>

            <div className="leg-card-grid">
              {bet.legs?.map((leg, index) => (
                <article key={leg.id} className="leg-card">
                  <p className="leg-card__eyebrow">Leg {index + 1}</p>
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
          </section>
        </div>
      ) : null}
    </main>
  );
}