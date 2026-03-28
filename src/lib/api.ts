const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not set.");
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export type BetLeg = {
  id: string;
  eventName: string | null;
  marketType: string | null;
  marketSubtype: string | null;
  selectionType: string | null;
  playerName: string | null;
  oddsAmerican: number | null;
};

export type Bet = {
  id: string;
  sportsbook: string | null;
  betImportId: string | null;
  externalBetId: string | null;
  betType: string;
  status: string;
  placedAt: string | null;
  stake: number | null;
  toWin: number | null;
  payout: number | null;
  legCount: number;
  legsPreview?: BetLeg[];
  legs?: BetLeg[];
};

export type ImportShareLinkResponse = {
  importId: string;
  betId?: string;
  sportsbook: "draftkings" | "fanduel" | "unknown";
  status: "pending" | "parsed" | "failed";
  parsedBet: {
    sportsbook: "draftkings" | "fanduel" | "unknown";
    betType: string;
    externalBetId?: string;
    status?: string;
    placedAt?: string;
    settledAt?: string;
    stake?: number;
    payout?: number;
    potentialPayout?: number;
    legs: Array<{
      eventName?: string;
      marketType?: string;
      marketSubtype?: string;
      selectionType?: string;
      playerName?: string;
      oddsAmerican?: number;
    }>;
  } | null;
  message?: string;
};

export async function importShareLink(url: string) {
  return apiFetch<ImportShareLinkResponse>("/api/imports/share-link", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

export async function listBets(limit?: number) {
  const query = limit ? `?limit=${limit}` : "";
  return apiFetch<{ bets: Bet[]; count: number }>(`/api/bets${query}`);
}

export async function getBetById(id: string) {
  return apiFetch<{ bet: Bet }>(`/api/bets/${id}`);
}