import { Router } from 'express';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getGoldPricePerGramUSD } from '#services/goldPriceService.js';
import { filterProducts } from '#services/productFilterService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const filePath = path.resolve(__dirname, '..', 'data', 'products.json');
    const raw = await readFile(filePath, 'utf-8');
    const products = JSON.parse(raw);

    const goldPrice = await getGoldPricePerGramUSD();

    const enriched = products.map((p) => {
      const popularityScore = Number(p.popularityScore) || 0;
      const weight = Number(p.weight) || 0;
      const priceUSD = Number(((popularityScore + 1) * weight * goldPrice).toFixed(2));
      return { ...p, priceUSD };
    });

    const filteredResult = filterProducts(enriched, req.query);

    res.json(filteredResult);
  } catch (err) {
    next(err);
  }
});

export default router;

