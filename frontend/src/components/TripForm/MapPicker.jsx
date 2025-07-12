
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import '../../styles/Map.css'; // Import the CSS file

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapViewUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position?.lat && position?.lng) {
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);
  return null;
};

const MapClickHandler = ({ onPositionChange }) => {
  useMapEvents({
    click(e) {
      onPositionChange({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });
  return null;
};

const MapPicker = ({ initialPosition, onPositionChange }) => {
  const [position, setPosition] = useState(initialPosition || { lat: 0, lng: 0 });
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  const handlePositionChange = (newPos) => {
    setPosition(newPos);
    onPositionChange(newPos);
  };

  const handleSearchButtonClick = (e) => {
    e.preventDefault();
    setShowSearch((prev) => !prev);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery) return;

    try {
      // Call the Nominatim geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const newPos = { lat, lng };
        setPosition(newPos);
        onPositionChange(newPos);
      } else {
        alert('Location not found.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Error searching location.');
    }
  };

  return (
    <div className="map-picker">
      <MapContainer
        center={position}
        zoom={8}
        style={{ height: '400px', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {position.lat !== 0 && position.lng !== 0 && (
          <Marker position={[position.lat, position.lng]} />
        )}
        <MapClickHandler onPositionChange={handlePositionChange} />
        <MapViewUpdater position={position} />
      </MapContainer>

      <div className="map-picker-controls">
        <button
          type="button"
          onClick={handleSearchButtonClick}
          className="map-picker-button"
        >
          {showSearch ? 'Close Search' : 'Search'}
        </button>
        {showSearch && (
          <div className="map-picker-search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Enter location"
              className="map-picker-search-input"
            />
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="map-picker-search-submit"
            >
              Go
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPicker;
