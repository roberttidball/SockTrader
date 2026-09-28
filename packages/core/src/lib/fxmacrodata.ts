export type FXMacroDataQuery = Record<
  string,
  string | number | boolean | undefined | null
>;

export class FXMacroDataClient {
  constructor(
    private readonly apiKey?: string,
    private readonly baseUrl = 'https://api.fxmacrodata.com/v1'
  ) {}

  dataCatalogue(currency: string) {
    return this.get(`/data_catalogue/${normalize(currency)}`);
  }

  // History endpoints return 20 rows by default and at most 100 per request,
  // newest first. Pass { limit, offset, start_date, end_date } in `query` and
  // follow `pagination.next_offset` while `pagination.has_more` is true.
  announcements(currency: string, indicator: string, query?: FXMacroDataQuery) {
    return this.get(
      `/announcements/${normalize(currency)}/${indicator}`,
      query
    );
  }

  calendar(currency: string) {
    return this.get(`/calendar/${normalize(currency)}`);
  }

  predictions(currency: string, indicator: string, query?: FXMacroDataQuery) {
    return this.get(`/predictions/${normalize(currency)}/${indicator}`, query);
  }

  forex(base: string, quote: string, query?: FXMacroDataQuery) {
    return this.get(`/forex/${normalize(base)}/${normalize(quote)}`, query);
  }

  cot(currency: string, query?: FXMacroDataQuery) {
    return this.get(`/cot/${normalize(currency)}`, query);
  }

  commoditiesLatest() {
    return this.get('/commodities/latest');
  }

  commodity(indicator: string, query?: FXMacroDataQuery) {
    return this.get(`/commodities/${indicator}`, query);
  }

  curves(currency: string) {
    return this.get(`/curves/${normalize(currency)}`);
  }

  curveProxies(currency: string) {
    return this.get(`/curve_proxies/${normalize(currency)}`);
  }

  forwardCurves(currency: string) {
    return this.get(`/forward_curves/${normalize(currency)}`);
  }

  marketSessions() {
    return this.get('/market_sessions');
  }

  riskSentiment(query?: FXMacroDataQuery) {
    return this.get('/risk_sentiment', query);
  }

  news(currency: string) {
    return this.get(`/news/${normalize(currency)}`);
  }

  pressReleases(currency: string) {
    return this.get(`/press-releases/${normalize(currency)}`);
  }

  centralBankers(currency: string) {
    return this.get(`/central_bankers/${normalize(currency)}`);
  }

  async get(path: string, query: FXMacroDataQuery = {}) {
    const headers: Record<string, string> = this.apiKey
      ? { 'X-API-Key': this.apiKey }
      : {};
    const response = await fetch(this.url(path, query), { headers });
    if (!response.ok)
      throw new Error(`FXMacroData request failed: ${response.status}`);
    return response.json();
  }

  url(path: string, query: FXMacroDataQuery = {}) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) params.set(key, String(value));
    }
    const suffix = params.toString();
    return `${this.baseUrl.replace(/\/$/, '')}${path}${
      suffix ? `?${suffix}` : ''
    }`;
  }
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
