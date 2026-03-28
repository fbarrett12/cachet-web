import { useState } from "react";
import { Link } from "react-router-dom";
import {
  formatCurrency,
  formatDateTime,
  importShareLink,
  type ImportShareLinkResponse,
} from "../lib/api";

export function ImportPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportShareLinkResponse | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await importShareLink(url);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="page__header">
        <h1 className="page__title">Import a shared bet</h1>
        <p className="page__subtitle">
          Paste a DraftKings or FanDuel share link to bring a bet into Cachet.
        </p>
      </div>

      <div className="stack">
        <section className="card card--accent">
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
            <h2 className="card__title">Import Result</h2>

            <div className="badge-row">
              <span className="badge">{result.sportsbook}</span>
              <span className="badge badge--accent">{result.status}</span>
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

              {result.parsedBet ? (
                <>
                  <p>
                    <strong>Bet Type:</strong> {result.parsedBet.betType}
                  </p>
                  <p>
                    <strong>Status:</strong> {result.parsedBet.status ?? "—"}
                  </p>
                  <p>
                    <strong>Placed At:</strong>{" "}
                    {formatDateTime(result.parsedBet.placedAt)}
                  </p>
                  <p>
                    <strong>Stake:</strong> {formatCurrency(result.parsedBet.stake)}
                  </p>
                  <p>
                    <strong>Payout:</strong>{" "}
                    {formatCurrency(result.parsedBet.payout)}
                  </p>
                  <p>
                    <strong>Leg Count:</strong> {result.parsedBet.legs.length}
                  </p>
                </>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}