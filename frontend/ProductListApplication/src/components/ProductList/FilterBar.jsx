import React, { useState, useEffect } from 'react';
import './FilterBar.css';

const clampNumber = (value, min, max) => {
  if (value === '' || value === null || value === undefined) return '';
  const n = Number(value);
  if (!isFinite(n)) return '';
  return Math.min(max, Math.max(min, n));
};

const FilterBar = ({
  initialMinPrice = '',
  initialMaxPrice = '',
  initialMinStars = '',
  initialMaxStars = '',
  onChange,
}) => {
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [minStars, setMinStars] = useState(initialMinStars);
  const [maxStars, setMaxStars] = useState(initialMaxStars);

  useEffect(() => {
    onChange?.({ minPrice, maxPrice, minStars, maxStars });
  }, [minPrice, maxPrice, minStars, maxStars]);

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label className="filter-label">Min Price ($)</label>
        <input
          className="filter-input"
          type="number"
          min="0"
          step="0.01"
          value={minPrice}
          onChange={(e) => setMinPrice(clampNumber(e.target.value, 0, 1000000))}
          placeholder="e.g. 100"
        />
      </div>
      <div className="filter-group">
        <label className="filter-label">Max Price ($)</label>
        <input
          className="filter-input"
          type="number"
          min="0"
          step="0.01"
          value={maxPrice}
          onChange={(e) => setMaxPrice(clampNumber(e.target.value, 0, 1000000))}
          placeholder="e.g. 1500"
        />
      </div>
      <div className="filter-group">
        <label className="filter-label">Min Stars</label>
        <select
          className="filter-select"
          value={minStars}
          onChange={(e) => setMinStars(e.target.value)}
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="4.5">4.5+</option>
          <option value="5">5</option>
        </select>
      </div>
      <div className="filter-group">
        <label className="filter-label">Max Stars</label>
        <select
          className="filter-select"
          value={maxStars}
          onChange={(e) => setMaxStars(e.target.value)}
        >
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="4.5">4.5</option>
          <option value="5">5</option>
        </select>
      </div>
      <div className="filter-actions">
        <button
          className="filter-button clear"
          type="button"
          onClick={() => {
            setMinPrice('');
            setMaxPrice('');
            setMinStars('');
            setMaxStars('');
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default FilterBar;


