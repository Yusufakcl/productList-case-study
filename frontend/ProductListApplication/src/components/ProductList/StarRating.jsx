import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, maxRating = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxRating - Math.ceil(rating);

  return (
    <div className="star-rating">
      <div className="stars">
       
        {[...Array(fullStars)].map((_, index) => (
          <span key={`full-${index}`} className="star full">★</span>
        ))}
        
        
        {hasHalfStar && <span className="star half">★</span>}
        
       
        {[...Array(emptyStars)].map((_, index) => (
          <span key={`empty-${index}`} className="star empty">★</span>
        ))}
      </div>
      <span className="rating-value">{rating}/5</span>
    </div>
  );
};

export default StarRating;