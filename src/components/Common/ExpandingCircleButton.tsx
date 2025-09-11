// components/ExpandingCircleButton.js
import React from 'react';

const ExpandingCircleButton = () => {
  return (
    <button className="circleButton">
      <span className="plusIcon">+</span>
      <span className="buttonText">Select Package!</span>
    </button>
  );
};

export default ExpandingCircleButton;