import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  formatCurrency,
  formatDateTime,
  formatOdds,
  formatStatus,
  listBets,
} from "../lib/api";
import { LoadingCard } from "../components/LoadingCard";

export function BetsPage() {
  const [search, setSearch] = useState("");
  const [sportsbookFilter, setSportsbookFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const query = useQuery({
    queryKey: ["bets"],
    queryFn: () => listBets(25),
  });

  const bets = query.data?.bets ?? [];

  const filteredBets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return bets.filter((bet) => {
      const matchesSportsbook =
        sportsbookFilter === "all" || bet.sportsbook === sportsbookFilter;

      const matchesStatus =
        statusFilter === "all" || bet.status === statusFilter;

      const searchableText = [
        bet.sportsbook,
        bet.betType,
        bet.status,
        bet.externalBetId,
        ...(bet.legsPreview ?? []).flatMap((leg) => [
          leg.eventName,
          leg.marketSubtype,
          leg.selectionType,
          leg.playerName,
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 || searchableText.includes(normalizedSearch);

      return matchesSportsbook && matchesStatus && matchesSearch;
    });
  }, [bets, search, sportsbookFilter, statusFilter]);

  const totalStake = filteredBets.reduce((sum, bet) => sum + (bet.stake ?? 0), 0);
  const totalPayout = filteredBets.reduce((sum, bet) => sum + (bet.payout ?? 0), 0);
  const wonCount = filteredBets.filter((bet) => bet.status === "won").length;

  return (
    <main className="page">
      <div className="page__header">
        <h1 className="page__title">Bets</h1>
        <p className="page__subtitle">
          Review imported bets and search through your growing history.
        </p>
      </div>

      {query.isLoading ? (
        <div className="stack">
          <LoadingCard lines={3} />
          <LoadingCard lines={4} />
          <LoadingCard lines={4} />
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
              <p className="stat-card__label">Visible Bets</p>
              <p className="stat-card__value">{filteredBets.length}</p>
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

          <section className="card filters-card">
            <div className="filters-grid">
              <div>
                <label className="field-label" htmlFor="bet-search">
                  Search
                </label>
                <input
                  id="bet-search"
                  className="input"
                  type="text"
                  placeholder="Search team, market, selection..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="sportsbook-filter">
                  Sportsbook
                </label>
                <select
                  id="sportsbook-filter"
                  className="input"
                  value={sportsbookFilter}
                  onChange={(e) => setSportsbookFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="draftkings">DraftKings</option>
                  <option value="fanduel">FanDuel</option>
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="status-filter">
                  Status
                </label>
                <select
                  id="status-filter"
                  className="input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </section>

          {filteredBets.length === 0 ? (
            <section className="card empty-state">
              <h2 className="card__title">No matching bets</h2>
              <p className="muted">
                Try adjusting your search or filters, or import a new bet.
              </p>
              <div>
                <Link to="/">Go to Import</Link>
              </div>
            </section>
          ) : (
            <div className="bet-list">
              {filteredBets.map((bet) => (
                <article key={bet.id} className="card">
                  <div className="bet-card__top">
                    <div className="bet-card__meta">
                      <div className="badge-row">
                        <span className="badge">{bet.sportsbook ?? "unknown"}</span>
                        <span className="badge">{bet.betType}</span>
                        <span className="badge badge--accent">
                          {formatStatus(bet.status)}
                        </span>
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
                          {leg.oddsAmerican != null
                            ? ` (${formatOdds(leg.oddsAmerican)})`
                            : ""}
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