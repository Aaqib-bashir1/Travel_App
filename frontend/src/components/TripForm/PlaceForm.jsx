import React, { useState, useEffect } from 'react';
import MapPicker from './MapPicker';

function PlaceForm({ initialData = null, onSubmit, onCancel }) {
  const [placeData, setPlaceData] = useState({
    name: initialData?.name || '',
    cost: initialData?.cost || '',
    description: initialData?.description || '',
    best_time_to_visit: initialData?.best_time_to_visit || '',
    media: initialData?.media || [],
    coordinates: initialData?.coordinates || { lat: 0, lng: 0 },
  });

  useEffect(() => {
    if (initialData) {
      setPlaceData({
        name: initialData.name || '',
        cost: initialData.cost || '',
        description: initialData.description || '',
        best_time_to_visit: initialData.best_time_to_visit || '',
        media: initialData.media || [],
        coordinates: initialData.coordinates || { lat: 0, lng: 0 },
      });
    } else {
      setPlaceData({
        name: '',
        cost: '',
        description: '',
        best_time_to_visit: '',
        media: [],
        coordinates: { lat: 0, lng: 0 },
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setPlaceData((prev) => ({ ...prev, media: [...prev.media, ...files] }));
  };

  const handleCoordinatesChange = (newCoords) => {
    setPlaceData((prev) => ({ ...prev, coordinates: newCoords }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(placeData);
    if (!initialData) {
      setPlaceData({
        name: '',
        cost: '',
        description: '',
        best_time_to_visit: '',
        media: [],
        coordinates: { lat: 0, lng: 0 },
      });
    }
  };

  return (
    <div className="place-form">
      <h3>{initialData ? 'Edit Place' : 'Add Place Visited'}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={placeData.name} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div>
          <label>Cost:</label>
          <input 
            type="number" 
            name="cost" 
            value={placeData.cost} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea 
            name="description" 
            value={placeData.description} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div>
          <label>Best Time to Visit:</label>
          <input 
            type="text" 
            name="best_time_to_visit" 
            value={placeData.best_time_to_visit} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div>
          <label>Media:</label>
          <input 
            type="file" 
            name="media" 
            multiple 
            onChange={handleMediaChange} 
          />
        </div>
        <div>
          <label>Coordinates (Click on the map):</label>
          <MapPicker 
            initialPosition={placeData.coordinates} 
            onPositionChange={handleCoordinatesChange} 
          />
        </div>
        <button type="submit">
          {initialData ? 'Update Place' : 'Add Place'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>Cancel</button>
        )}
      </form>
    </div>
  );
}

export default PlaceForm;
