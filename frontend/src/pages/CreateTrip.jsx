

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import TripForm from '../components/TripForm/TripForm';
import MediaUploader from '../components/TripForm/MediaUploader';
import MapPicker from '../components/TripForm/MapPicker';
import '../styles/TripCreate.css';

function TripCreatePage() {
  const navigate = useNavigate();
  const initialPosition = { lat: "", lng: "" };

  const [tripData, setTripData] = useState({
    title: '',
    description: '',
    days: '',
    nights: '',
    starting_location: '',
    cost: '',
    best_time_to_visit: '',
    emergency_numbers: '',
    location: { type: 'Point', coordinates: [initialPosition.lng, initialPosition.lat] },
    currency_used: '',
    language_spoken: '',
    number_of_people: '',
    places_visited: [],
    activities: [],
    hotels: [],
    restaurants: []
  });

  const [coverImage, setCoverImage] = useState(null);
  const [media, setMedia] = useState([]);
  const [coordinates, setCoordinates] = useState(initialPosition);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [tripCreated, setTripCreated] = useState(false);
  const [tripId, setTripId] = useState(null);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setTripData((prev) => ({
      ...prev,
      [name]: ['days', 'nights', 'cost', 'number_of_people'].includes(name) && value !== '' 
        ? Number(value) 
        : value,
    }));
  }, []);

  const handleCoverImageChange = useCallback((e) => {
    setCoverImage(e.target.files[0]);
  }, []);

  const handleMediaChange = useCallback((e, index) => {
    const { name, files, value } = e.target;
    setMedia((prevMedia) => {
      const newMedia = [...prevMedia];
      newMedia[index] = {
        ...newMedia[index],
        [name]: name === 'file' ? files[0] : value,
      };
      return newMedia;
    });
  }, []);

  const addMediaField = useCallback(() => {
    setMedia((prevMedia) => [...prevMedia, { file: null, type: 'image', caption: '' }]);
  }, []);

  const removeMediaField = useCallback((index) => {
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
  }, []);

  const convertToGeoJSON = (coords) => ({ 
    type: 'Point', 
    coordinates: [coords.lng, coords.lat] 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // First create the trip without media
      const tripFormData = new FormData();
      
      // Append trip data
      Object.entries(tripData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          if (key === 'location') {
            tripFormData.append(key, JSON.stringify(value));
          } else if (Array.isArray(value)) {
            tripFormData.append(key, JSON.stringify(value));
          } else {
            tripFormData.append(key, value);
          }
        }
      });

      // Append cover image
      if (coverImage) {
        tripFormData.append('image_cover', coverImage);
      }

      // Create trip
      const tripResponse = await api.post('/api/users/my-trips/', tripFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (tripResponse.status === 201) {
        const createdTrip = tripResponse.data;
        setTripId(createdTrip.id);
        setSuccessMessage('Trip created successfully! Uploading media...');
        setTripCreated(true);

        // Upload media files to separate endpoint
        if (media.length > 0) {
          try {
            await Promise.all(media.map(async (mediaItem) => {
              if (mediaItem.file) {
                const mediaFormData = new FormData();
                mediaFormData.append('file', mediaItem.file);
                mediaFormData.append('media_type', mediaItem.type);
                mediaFormData.append('caption', mediaItem.caption);
                await api.post(`/api/users/my-trips/${createdTrip.id}/media/`, mediaFormData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                });
                
}
            }));
            setSuccessMessage('Trip and media uploaded successfully!');
          } catch (mediaErr) {
            setError('Trip created, but some media failed to upload.');
          }
        } else {
          setSuccessMessage('Trip created successfully!');
        }
      }
    } catch (err) {
      console.error('Error:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-create-page">
      <h1>Create New Trip</h1>
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      {!tripCreated ? (
        <form onSubmit={handleSubmit}>
          <TripForm tripData={tripData} handleInputChange={handleInputChange} />

          <div className="form-section">
            <h3>Media</h3>
            <MediaUploader
              includeCover={true}
              coverImage={coverImage}
              media={media}
              handleCoverImageChange={handleCoverImageChange}
              handleMediaChange={handleMediaChange}
              addMediaField={addMediaField}
              removeMediaField={removeMediaField}
            />
          </div>

          <div className="form-section">
            <h3>Location</h3>
            <MapPicker
              initialPosition={coordinates}
              onPositionChange={(newCoords) => {
                if (newCoords.lat >= -90 && newCoords.lat <= 90 &&
                    newCoords.lng >= -180 && newCoords.lng <= 180) {
                  setCoordinates(newCoords);
                  setTripData(prev => ({
                    ...prev,
                    location: convertToGeoJSON(newCoords)
                  }));
                } else {
                  setError('Invalid coordinates provided.');
                }
              }}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Trip'}
          </button>
        </form>
      ) : (
        <div className="post-creation-actions">
          <h2>Trip Created Successfully!</h2>
          <button onClick={() => navigate(`/my-trips/${tripId}/edit`)}>
            Edit Trip
          </button>
        </div>
      )}
    </div>
  );
}

export default TripCreatePage;