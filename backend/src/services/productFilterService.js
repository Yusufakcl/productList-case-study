export function filterProducts(products, filters) {
  const { minPrice, maxPrice, minPopularity, maxPopularity } = filters;

  let filteredResult = products;
  
  if (minPrice) {
    filteredResult = filteredResult.filter(p => p.priceUSD >= parseFloat(minPrice));
  }
  
  if (maxPrice) {
    filteredResult = filteredResult.filter(p => p.priceUSD <= parseFloat(maxPrice));
  }

  if (minPopularity) {
    filteredResult = filteredResult.filter(p => p.popularityScore >= parseFloat(minPopularity));
  }
  
  if (maxPopularity) {
    filteredResult = filteredResult.filter(p => p.popularityScore <= parseFloat(maxPopularity));
  }

  return filteredResult;
}

