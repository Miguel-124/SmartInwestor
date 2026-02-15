/** Wyszukiwanie symboli i sugestii – ta sama logika co w mobilce (CoinGecko, Alpha Vantage, Finnhub). */
import axios from 'axios';
import { FINNHUB_TOKEN } from './prices';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/search';
const FINNHUB_API_URL = 'https://finnhub.io/api/v1/search';
const ALPHA_VANTAGE_API_URL = 'https://www.alphavantage.co/query';
const ALPHA_VANTAGE_API_KEY = 'SZ842O6PT1AMVFGH';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  current_price: number | null;
}

export async function searchAssets(
  query: string,
  assetType: 'stock' | 'crypto'
): Promise<Asset[]> {
  try {
    if (assetType === 'crypto') {
      const response = await axios.get<{ coins: { id: string; symbol: string; name: string }[] }>(
        `${COINGECKO_API_URL}?query=${encodeURIComponent(query)}`
      );
      return (response.data.coins || []).map((coin) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        current_price: null,
      }));
    }
    if (assetType === 'stock' && query.length >= 3) {
      const alphaUrl = `${ALPHA_VANTAGE_API_URL}?function=GLOBAL_QUOTE&symbol=${query.toUpperCase()}&apikey=${ALPHA_VANTAGE_API_KEY}`;
      const alphaRes = await axios.get<{ 'Global Quote'?: { '05. price'?: string } }>(alphaUrl);
      const gq = alphaRes.data?.['Global Quote'];
      const priceStr = gq?.['05. price'];
      if (priceStr != null) {
        const price = parseFloat(priceStr);
        const sym = query.toUpperCase();
        return [{ id: sym, symbol: sym, name: sym, current_price: isNaN(price) ? null : price }];
      }
      const finnRes = await axios.get<{ result: { symbol: string; description: string }[] }>(
        `${FINNHUB_API_URL}?q=${encodeURIComponent(query)}&token=${FINNHUB_TOKEN}`
      );
      return (finnRes.data.result || []).map((a) => ({
        id: a.symbol,
        symbol: a.symbol,
        name: a.description,
        current_price: null,
      }));
    }
    return [];
  } catch (err) {
    console.error('searchAssets', err);
    return [];
  }
}
