import React from 'react';

const TripActionButtons = ({ tripId, handleAddDetails }) => {
  return (
    <div className="action-buttons">
      <button 
        onClick={() => handleAddDetails('activities')}
        className="btn-action"
      >
        Add Activities
      </button>
      <button 
        onClick={() => handleAddDetails('hotels')}
        className="btn-action"
      >
        Add Hotels
      </button>
      <button 
        onClick={() => handleAddDetails('restaurants')}
        className="btn-action"
      >
        Add Restaurants
      </button>
    </div>
  );
};

export default TripActionButtons;