import axios from 'axios';

const TTL_MS = Number(process.env.GOLD_CACHE_TTL_MS) || 10 * 60 * 1000;
const FALLBACK_PRICE_PER_GRAM_USD =
  Number(process.env.FALLBACK_GOLD_PRICE_USD_PER_GRAM) || 60;

let cache = { price: null, ts: 0 };
const TROY_OUNCE_TO_GRAM = 31.1034768;

async function fetchPricePerGramUSD() {
  const apiKey = process.env.GOLD_API_KEY;
  if (!apiKey) {
    return FALLBACK_PRICE_PER_GRAM_USD;
  }

  try {
    const resp = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    

    const data = resp.data;
    const pricePerOunce = Number(data?.price);
    if (!isFinite(pricePerOunce) || pricePerOunce <= 0) {
      throw new Error('Invalid price from provider');
    }

    const perGram = pricePerOunce / TROY_OUNCE_TO_GRAM;
    return perGram;
  } catch (err) {
    console.warn('Gold price fetch failed:', err.message);
    return FALLBACK_PRICE_PER_GRAM_USD;
  }
}

export async function getGoldPricePerGramUSD() {
  const now = Date.now();
  if (cache.price && now - cache.ts < TTL_MS) {
    return cache.price;
  }
  const price = await fetchPricePerGramUSD();
  cache = { price, ts: now };
  return price;
}

