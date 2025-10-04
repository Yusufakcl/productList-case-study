import React from 'react';
import './NavigationArrow.css';

const NavigationArrow = ({ direction, onClick, disabled }) => {
  return (
    <button
      className={`navigation-arrow ${direction} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Navigate ${direction}`}
    >
      {direction === 'left' ? '‹' : '›'}
    </button>
  );
};

export default NavigationArrow;