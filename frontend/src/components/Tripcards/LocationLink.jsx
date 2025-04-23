import React from 'react';

export const GoogleMapLink = ({ coordinates }) => {
  // Check if coordinates are not valid
  if (!coordinates || typeof coordinates !== 'string') {
    console.warn('Missing or invalid coordinates:', coordinates);
    return <p>Coordinates are unavailable.</p>;  // Display a fallback message
  }

  // Check for a basic lat-long format
  const simpleCoordinates = coordinates.match(/^([-+]?\d*\.\d+|\d+),\s*([-+]?\d*\.\d+|\d+)$/);
  if (simpleCoordinates) {
    const latitude = parseFloat(simpleCoordinates[1]);
    const longitude = parseFloat(simpleCoordinates[2]);
    return (
      <a href={`https://www.google.com/maps?q=${latitude},${longitude}`} target="_blank" rel="noopener noreferrer">
        View on Google Maps
      </a>
    );
  }

  // If coordinates are in POINT format, try parsing them
  const match = coordinates.match(/^SRID=\d+;POINT \(([-+]?\d*\.\d+|\d+)\s([-+]?\d*\.\d+|\d+)\)$/);
  if (!match) {
    console.warn('Invalid coordinates format:', coordinates);
    return <p>Invalid coordinates format.</p>;  // Display a fallback message
  }

  const longitude = parseFloat(match[1]);
  const latitude = parseFloat(match[2]);

  if (isNaN(latitude) || isNaN(longitude)) {
    console.warn('Invalid latitude or longitude:', latitude, longitude);
    return <p>Invalid coordinates.</p>;  // Display a fallback message
  }

  return (
    <a href={`https://www.google.com/maps?q=${latitude},${longitude}`} target="_blank" rel="noopener noreferrer">
      View on Google Maps
    </a>
  );
};
