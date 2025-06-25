import React from 'react';
import './BookLoader.css';

const BookLoader = () => {
  return (
    <div className="book-loader-container">
      <div className="book">
        <div className="page page1"></div>
        <div className="page page2"></div>
        <div className="page page3"></div>
      </div>
      <p className="loading-message">Loading user details...</p>
    </div>
  );
};

export default BookLoader;
