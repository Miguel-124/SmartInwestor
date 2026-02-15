/** Pobieranie aktualnych cen – ta sama logika co w mobilce (Binance, Alpha Vantage, Finnhub). */
export const FINNHUB_TOKEN = 'cvjc3ehr01qlscpb681gcvjc3ehr01qlscpb6820';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1/quote';
const BINANCE_BASE_URL = 'https://api.binance.com/api/v3/ticker/price';
const ALPHA_VANTAGE_API_URL = 'https://www.alphavantage.co/query';
const ALPHA_VANTAGE_API_KEY = 'N4HGRWO36EH2DMKL';

export async function getPriceForTicker(
  ticker: string,
  assetType: 'stock' | 'crypto'
): Promise<number | null> {
  const upperTicker = ticker.toUpperCase();
  try {
    if (assetType === 'crypto') {
      const symbol = `${upperTicker}USDT`;
      const res = await fetch(`${BINANCE_BASE_URL}?symbol=${symbol}`);
      const data = await res.json();
      return data?.price != null ? parseFloat(data.price) : null;
    }
    if (assetType === 'stock') {
      const url = `${ALPHA_VANTAGE_API_URL}?function=TIME_SERIES_INTRADAY&symbol=${upperTicker}&interval=1min&apikey=${ALPHA_VANTAGE_API_KEY}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const series = data['Time Series (1min)'];
        if (series) {
          const latestTime = Object.keys(series)[0];
          const price = parseFloat(series[latestTime]?.['4. close']);
          if (!isNaN(price)) return price;
        }
      }
      const quoteUrl = `${FINNHUB_BASE_URL}?symbol=${upperTicker}&token=${FINNHUB_TOKEN}`;
      const quoteRes = await fetch(quoteUrl);
      const quoteData = await quoteRes.json();
      if (quoteData?.c != null) return parseFloat(quoteData.c);
    }
    return null;
  } catch (err) {
    console.error(`getPriceForTicker ${ticker}:`, err);
    return null;
  }
}
