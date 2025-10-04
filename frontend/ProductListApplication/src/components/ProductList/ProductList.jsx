import React, { useState, useEffect, useMemo } from 'react';
import ProductCarousel from './ProductCarousel';
import FilterBar from './FilterBar';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', minStars: '', maxStars: '' });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.minPrice !== '' && isFinite(Number(filters.minPrice))) {
      params.set('minPrice', String(filters.minPrice));
    }
    if (filters.maxPrice !== '' && isFinite(Number(filters.maxPrice))) {
      params.set('maxPrice', String(filters.maxPrice));
    }

    let popMin = '';
    let popMax = '';
    if (filters.minStars !== '' && isFinite(Number(filters.minStars))) {
      const minStarsNum = Math.min(5, Math.max(1, Number(filters.minStars)));
      popMin = minStarsNum <= 1 ? 0 : Number((minStarsNum / 5).toFixed(2));
    }
    if (filters.maxStars !== '' && isFinite(Number(filters.maxStars))) {
      const maxStarsNum = Math.min(5, Math.max(1, Number(filters.maxStars)));
      popMax = Number((maxStarsNum / 5).toFixed(2));
    }
    if (popMin !== '' && popMax !== '' && popMin > popMax) {
      const tmp = popMin; popMin = popMax; popMax = tmp;
    }
    if (popMin !== '') params.set('minPopularity', String(popMin));
    if (popMax !== '') params.set('maxPopularity', String(popMax));
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  }, [filters]);

  useEffect(() => {
    const controller=new AbortController();
    const fetchProducts = async () => {
      try {
        const res= await fetch(`/api/products${queryString}`,{signal:controller.signal})
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        
        
        const transformedProducts = data.map((product, index) => {
          const rawRating=Number((product.popularityScore*5).toFixed(1));
          const rating=Math.min(5,Math.max(1,rawRating));
          return{
            id: index + 1,
            title: product.name,
            price: `$${product.priceUSD.toFixed(2)} USD`,
            priceValue: product.priceUSD,
            images: product.images,
            colors: [
              { name: 'Yellow Gold', code: '#EECA97', imageKey: 'yellow', available: true },
              { name: 'White Gold', code: '#D9D9D9', imageKey: 'white', available: true },
              { name: 'Rose Gold', code: '#E1A4A9', imageKey: 'rose', available: true }
            ],
            selectedColor: 'yellow',
            rating
          }
        });

        setProducts(transformedProducts);
        setLoading(false);
      } catch (err) {
        if(err.name !== 'AbortError'){
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return ()=>controller.abort();
  }, [queryString]);

  if (loading) {
    return (
      <div className="product-list-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
    
      <header className="product-list-header">
        <h1 className="product-list-title">Product List</h1>
      </header>

      <FilterBar
        initialMinPrice=""
        initialMaxPrice=""
        initialMinStars=""
        initialMaxStars=""
        onChange={(vals) => setFilters(vals)}
      />

      
      <ProductCarousel products={products} />
    </div>
  );
};

export default ProductList;