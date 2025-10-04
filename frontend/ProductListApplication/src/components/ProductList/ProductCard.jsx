import React, { useState } from 'react';
import ColorSelector from './ColorSelector';
import StarRating from './StarRating';
import './ProductCard.css';

const ProductCard = ({ product, cardWidth }) => {
  const [selectedColor, setSelectedColor] = useState(product.selectedColor);
  const [currentImage, setCurrentImage] = useState(product.images?.[product.selectedColor]?? '');

  const handleColorChange = (colorImageKey) => {
    setSelectedColor(colorImageKey);
    setCurrentImage(product.images[colorImageKey]);
  };

  return (
    <div className="product-card" style={{ width: cardWidth }}>
      
      <div className="product-image-container">
        <img 
          src={currentImage} 
          alt={product.title}
          className="product-image"
          loading="lazy"
        />
      </div>

      
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">{product.price}</p>

       
        <ColorSelector 
          colors={product.colors}
          selectedColor={selectedColor}
          onColorChange={handleColorChange}
        />

        
        <span className="selected-color-name">
          {product.colors.find(c => c.imageKey === selectedColor)?.name || 'Yellow Gold'}
        </span>

        {/* Rating */}
        <StarRating 
          rating={product.rating}
          maxRating={5}
        />
      </div>
    </div>
  );
};

export default ProductCard;