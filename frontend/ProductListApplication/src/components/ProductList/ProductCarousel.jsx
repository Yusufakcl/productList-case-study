import React, { useState,useRef,useEffect } from 'react';
import ProductCard from './ProductCard';
import NavigationArrow from '@/components/common/NavigationArrow';
import './ProductCarousel.css';

const ProductCarousel = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const viewportRef = useRef(null);

  const [gapPx, setGapPx] = useState(0);
  const [cardWidthPx, setCardWidthPx] = useState(0);
  const [slideStepPx, setSlideStepPx] = useState(0);
  const [maxTranslatePx, setMaxTranslatePx] = useState(0);
  const [viewportWidthPx, setViewportWidthPx] = useState(0);
  const [totalContentWidthPx, setTotalContentWidthPx] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setVisibleCards(1);
      } else if (window.innerWidth <= 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const compute = () => {
      if (!viewportRef.current) return;

      const trackElement = viewportRef.current.querySelector('.carousel-track');
      if (!trackElement) return;

      const computedStyle = window.getComputedStyle(trackElement);
      const gap = parseFloat(computedStyle.gap) || 0;

      const viewportWidth = viewportRef.current.clientWidth;

      
      const rawCardWidth = (viewportWidth - (visibleCards - 1) * gap) / visibleCards;
      const cardWidth = Math.floor(rawCardWidth); 
      const step = cardWidth + gap;

      const totalContentWidth =
        products.length * cardWidth + Math.max(0, products.length - 1) * gap;
      
      const maxTranslate = Math.max(0, Math.ceil(totalContentWidth - viewportWidth));

      setGapPx(gap);
      setCardWidthPx(cardWidth);
      setSlideStepPx(step);
      setMaxTranslatePx(maxTranslate);
      setViewportWidthPx(viewportWidth);
      setTotalContentWidthPx(totalContentWidth);

      
      const maxIndex = Math.max(0, products.length - visibleCards);
     
      setCurrentIndex(prev => {
        const clamped = Math.min(prev, maxIndex);
        return clamped;
      });
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [visibleCards, products.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(products.length - visibleCards, prev + 1)
    );
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < products.length - visibleCards;
  const translatePx = Math.min(currentIndex * slideStepPx, maxTranslatePx);
  const progress = maxTranslatePx > 0 ? translatePx / maxTranslatePx : 0;
  const thumbWidthPercent = totalContentWidthPx > 0
    ? Math.max(8, (viewportWidthPx / totalContentWidthPx) * 100)
    : 100;

  return (
    <div className="carousel-container">
      <NavigationArrow 
        direction="left" 
        onClick={handlePrevious}
        disabled={!canGoPrevious}
      />

      <div className="carousel-viewport" ref={viewportRef}>
        <div 
          className="carousel-track"
          style={{
            
            transform: `translateX(-${Math.min(currentIndex * slideStepPx, maxTranslatePx)}px)`
          }}
        >
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              
              cardWidth={cardWidthPx ? `${cardWidthPx}px` : undefined}
            />
          ))}
        </div>
      </div>

      <NavigationArrow 
        direction="right" 
        onClick={handleNext}
        disabled={!canGoNext}
      />
      
      <div className="carousel-scrollbar" aria-hidden="true">
        <div className="carousel-scrollbar-thumb"
          style={{
            width: `${thumbWidthPercent}%`,
            left: `${progress * (100 - thumbWidthPercent)}%`
          }}
        />
      </div>
    </div>
  );
};

export default ProductCarousel;