import React from 'react';
import './ColorSelector.css';

const ColorSelector = ({ colors, selectedColor, onColorChange }) => {
  return (
    <div className="color-selector">
      <div className="color-options">
        {colors.map((color) => (
          <button
            key={color.imageKey}
            className={`color-option ${selectedColor === color.imageKey ? 'selected' : ''}`}
            onClick={() => onColorChange(color.imageKey)}
            style={{ backgroundColor: color.code }}
            title={color.name}
            aria-label={color.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;