

import React, { useState, useEffect } from "react";
import api from "../../api";
import MapPicker from "./MapPicker";
import MediaUploader from "./MediaUploader";

const ActivityForm = ({ initialData, onSubmit ,tripId }) => {
  const [formData, setFormData] = useState({
    name: "",
    cost: 0,
    description: "",
    best_time_to_visit: "",
    location: { type: 'Point', coordinates: [0, 0] }, // Valid default coordinates
    media: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Convert between MapPicker's {lat, lng} and GeoJSON [lng, lat]
  const geoJsonToMapCoords = (geoJson) => ({
    lat: geoJson?.coordinates[1] || 0,
    lng: geoJson?.coordinates[0] || 0
  });

  const mapCoordsToGeoJson = (coords) => ({
    type: 'Point',
    coordinates: [coords.lng, coords.lat]
  });

  useEffect(() => {
    if (initialData) {
      const processedMedia = initialData.media?.map(media => ({
        ...media,
        file: media.file_url,
        cover_image: false
      })) || [];

      setFormData({
        ...initialData,
        media: processedMedia,
        location: initialData.location || { type: 'Point', coordinates: [0, 0] }
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "cost" ? Number(value) : value
    }));
  };

  const handleLocationSelect = (newCoords) => {
    if (!newCoords) return;
    
    if (newCoords.lat >= -90 && newCoords.lat <= 90 &&
        newCoords.lng >= -180 && newCoords.lng <= 180) {
      setFormData(prev => ({
        ...prev,
        location: mapCoordsToGeoJson(newCoords)
      }));
    } else {
      setError('Invalid coordinates provided.');
    }
  };

  const handleMediaChange = (e, index) => {
    const { name, files, value } = e.target;
    setFormData(prev => {
      const updatedMedia = [...prev.media];
      updatedMedia[index] = {
        ...updatedMedia[index],
        [name]: name === "file" ? files[0] : value,
        cover_image: false
      };
      return { ...prev, media: updatedMedia };
    });
  };

  const addMediaField = () => {
    setFormData(prev => ({
      ...prev,
      media: [
        ...prev.media,
        { 
          file: null, 
          media_type: "image", 
          caption: "",
          cover_image: false
        }
      ]
    }));
  };

  const removeMediaField = (index) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const handleDeleteMedia = async (mediaId) => {
    try {
      await api.delete(`/api/users/media/${mediaId}/`);
      setFormData(prev => ({
        ...prev,
        media: prev.media.filter(item => item.id !== mediaId)
      }));
    } catch (err) {
      setError("Failed to delete media from server");
    }
  };

  const uploadActivityMedia = async (activityId) => {
    if (!formData.media?.length) return;

    for (const mediaItem of formData.media) {
      try {
        if (mediaItem.id && !(mediaItem.file instanceof File)) continue;

        const mediaFormData = new FormData();
        mediaFormData.append("file", mediaItem.file);
        mediaFormData.append("caption", mediaItem.caption);
        mediaFormData.append("media_type", mediaItem.media_type);
        mediaFormData.append("cover_image", "false");

        mediaItem.id 
          ? await api.put(`/api/users/media/${mediaItem.id}/`, mediaFormData)
          : await api.post(`/api/users/activities/${activityId}/media/`, mediaFormData);
      } catch (err) {
        console.error("Media upload error:", err);
        throw new Error("Failed to upload some media files");
      }
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Activity name is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (isNaN(formData.cost) || formData.cost < 0) {
      setError("Invalid cost value");
      return false;
    }
    if (!formData.location?.coordinates?.every(Number.isFinite)) {
      setError("Valid location is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

  
  try {
    // Extract and convert location to WKT for DRF
    const { media: mediaArr, location, ...activityFields } = formData;
    const [lng, lat] = location.coordinates;
    const locWkt = `POINT(${lng} ${lat})`;
    const payload = {
      ...activityFields,
      cost: Number(formData.cost),
      location: locWkt,
      trip: tripId
    };

    console.log('Creating activity with payload:', payload);
    const isEdit = Boolean(initialData?.id);
    const url = isEdit
      ? `/api/users/activities/${initialData.id}/`
      : '/api/users/activities/';
    const response = isEdit ? await api.put(url, payload) : await api.post(url, payload);

    // Upload media separately
    await uploadActivityMedia(response.data.id);
    const fresh = await api.get(`/api/users/activities/${response.data.id}/`);
    onSubmit(fresh.data);
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || 'Error saving activity');
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="activity-form">
      <div className="form-group">
        <label>Activity Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Cost (USD) *</label>
        <input
          type="number"
          name="cost"
          value={formData.cost}
          onChange={handleInputChange}
          min="0"
          step="0.01"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows="4"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Best Time to Visit</label>
        <input
          type="text"
          name="best_time_to_visit"
          value={formData.best_time_to_visit}
          onChange={handleInputChange}
          placeholder="e.g., Spring mornings"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <h3>Location *</h3>
        <MapPicker
          initialPosition={geoJsonToMapCoords(formData.location)}
          onPositionChange={handleLocationSelect}
        />
        {!formData.location.coordinates.every(coord => coord !== 0) && (
          <div className="error-message">Please select a valid location on the map</div>
        )}
      </div>

      <div className="form-group">
        <MediaUploader
          media={formData.media}
          handleCoverImageChange={() => {}}
          handleMediaChange={handleMediaChange}
          addMediaField={addMediaField}
          removeMediaField={removeMediaField}
          handleDeleteMedia={handleDeleteMedia}
          showCoverImage={false}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Activity"}
      </button>
    </form>
  );
};

export default ActivityForm;