// import React, { useState, useEffect } from 'react';
// import MapPicker from './MapPicker';

// function RestaurantForm({ initialData = null, onSubmit, onCancel }) {
//   const [restaurantData, setRestaurantData] = useState({
//     name: initialData?.name || '',
//     cost: initialData?.cost || '',
//     description: initialData?.description || '',
//     rating: initialData?.rating || '',
//     meal_type: initialData?.meal_type || '',
//     media: initialData?.media || [],
//     coordinates: initialData?.coordinates || { lat: 0, lng: 0 },
//   });

//   useEffect(() => {
//     if (initialData) {
//       setRestaurantData({
//         name: initialData.name || '',
//         cost: initialData.cost || '',
//         description: initialData.description || '',
//         rating: initialData.rating || '',
//         meal_type: initialData.meal_type || '',
//         media: initialData.media || [],
//         coordinates: initialData.coordinates || { lat: 0, lng: 0 },
//       });
//     } else {
//       setRestaurantData({
//         name: '',
//         cost: '',
//         description: '',
//         rating: '',
//         meal_type: '',
//         media: [],
//         coordinates: { lat: 0, lng: 0 },
//       });
//     }
//   }, [initialData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setRestaurantData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleMediaChange = (e) => {
//     const files = Array.from(e.target.files);
//     setRestaurantData((prev) => ({ ...prev, media: [...prev.media, ...files] }));
//   };

//   const handleCoordinatesChange = (newCoords) => {
//     setRestaurantData((prev) => ({ ...prev, coordinates: newCoords }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(restaurantData);
//     if (!initialData) {
//       setRestaurantData({
//         name: '',
//         cost: '',
//         description: '',
//         rating: '',
//         meal_type: '',
//         media: [],
//         coordinates: { lat: 0, lng: 0 },
//       });
//     }
//   };

//   return (
//     <div className="restaurant-form">
//       <h3>{initialData ? 'Edit Restaurant' : 'Add Restaurant'}</h3>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Name:</label>
//           <input 
//             type="text" 
//             name="name" 
//             value={restaurantData.name} 
//             onChange={handleInputChange} 
//             required 
//           />
//         </div>
//         <div>
//           <label>Cost:</label>
//           <input 
//             type="number" 
//             name="cost" 
//             value={restaurantData.cost} 
//             onChange={handleInputChange} 
//             required 
//           />
//         </div>
//         <div>
//           <label>Description:</label>
//           <textarea 
//             name="description" 
//             value={restaurantData.description} 
//             onChange={handleInputChange} 
//             required 
//           />
//         </div>
//         <div>
//           <label>Rating:</label>
//           <input 
//             type="number" 
//             name="rating" 
//             value={restaurantData.rating} 
//             onChange={handleInputChange} 
//             required 
//           />
//         </div>
//         <div>
//           <label>Meal Type:</label>
//           <input 
//             type="text" 
//             name="meal_type" 
//             value={restaurantData.meal_type} 
//             onChange={handleInputChange} 
//             required 
//           />
//         </div>
//         <div>
//           <label>Media:</label>
//           <input 
//             type="file" 
//             name="media" 
//             multiple 
//             onChange={handleMediaChange} 
//           />
//         </div>
//         <div>
//           <label>Coordinates (Click on the map):</label>
//           <MapPicker 
//             initialPosition={restaurantData.coordinates} 
//             onPositionChange={handleCoordinatesChange} 
//           />
//         </div>
//         <button type="submit">
//           {initialData ? 'Update Restaurant' : 'Add Restaurant'}
//         </button>
//         {onCancel && (
//           <button type="button" onClick={onCancel}>Cancel</button>
//         )}
//       </form>
//     </div>
//   );
// }

// export default RestaurantForm;
// src/components/TripForm/RestaurantForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';
import MapPicker from './MapPicker';
import MediaUploader from './MediaUploader';

const RestaurantForm = ({ initialData = null, onSubmit, onCancel, tripId }) => {
  const [formData, setFormData] = useState({
    name: '',
    cost: 0,
    description: '',
    rating: 0,
    meal_type: '',
    location: { type: 'Point', coordinates: [0, 0] },
    media: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        cost: initialData.cost || 0,
        description: initialData.description || '',
        rating: initialData.rating || 0,
        meal_type: initialData.meal_type || '',
        location: initialData.location || { type: 'Point', coordinates: [0, 0] },
        media: initialData.media?.map(m => ({ ...m, file: m.file_url, cover_image: false })) || []
      });
    }
  }, [initialData]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['cost','rating'].includes(name) ? Number(value) : value
    }));
  };

  const handleLocationSelect = coords => {
    if (coords.lat < -90 || coords.lat > 90 || coords.lng < -180 || coords.lng > 180) {
      setError('Invalid coordinates');
      return;
    }
    setFormData(prev => ({
      ...prev,
      location: { type: 'Point', coordinates: [coords.lng, coords.lat] }
    }));
  };

  const handleMediaChange = (e, idx) => {
    const { name, files, value } = e.target;
    setFormData(prev => {
      const mediaArr = [...prev.media];
      mediaArr[idx] = {
        ...mediaArr[idx],
        [name]: name === 'file' ? files[0] : value,
        cover_image: false
      };
      return { ...prev, media: mediaArr };
    });
  };

  const addMediaField = () => setFormData(prev => ({
    ...prev,
    media: [...prev.media, { file: null, media_type: 'image', caption: '', cover_image: false }]
  }));

  const removeMediaField = idx => setFormData(prev => ({
    ...prev,
    media: prev.media.filter((_, i) => i !== idx)
  }));

  const handleDeleteMedia = async id => {
    try {
      await api.delete(`/api/users/media/${id}/`);
      setFormData(prev => ({ ...prev, media: prev.media.filter(m => m.id !== id) }));
    } catch {
      setError('Failed to delete media');
    }
  };

  const uploadRestaurantMedia = async restId => {
    for (const item of formData.media) {
      if (item.id && !(item.file instanceof File)) continue;
      const fd = new FormData();
      fd.append('file', item.file);
      fd.append('caption', item.caption);
      fd.append('media_type', item.media_type);
      fd.append('cover_image', 'false');
      if (item.id) {
        await api.put(`/api/users/media/${item.id}/`, fd);
      } else {
        await api.post(`/api/users/restaurants/${restId}/media/`, fd);
      }
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) return setError('Name is required'), false;
    if (formData.cost < 0) return setError('Cost must be non-negative'), false;
    if (!formData.description.trim()) return setError('Description is required'), false;
    if (formData.rating < 0 || formData.rating > 5) return setError('Rating between 0 and 5'), false;
    if (!formData.meal_type.trim()) return setError('Meal type is required'), false;
    if (!formData.location.coordinates.every(Number.isFinite)) return setError('Valid location is required'), false;
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    try {
      const { location, media: _, ...rest } = formData;
      const [lng, lat] = location.coordinates;
      const locationWkt = `POINT(${lng} ${lat})`;
      const payload = { ...rest, location: locationWkt, trip: tripId };
      const isEdit = Boolean(initialData?.id);
      const url = isEdit
        ? `/api/users/restaurants/${initialData.id}/`
        : '/api/users/restaurants/';
      const res = isEdit ? await api.put(url, payload) : await api.post(url, payload);
      await uploadRestaurantMedia(res.data.id);
      const fresh = await api.get(`/api/users/restaurants/${res.data.id}/`);
      onSubmit(fresh.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="restaurant-form">
      <h3>{initialData ? 'Edit Restaurant' : 'Add Restaurant'}</h3>
      {error && <div className="error-message">{error}</div>}
      <label>Name *</label>
      <input
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        disabled={loading}
        required
      />

      <label>Cost *</label>
      <input
        type="number"
        name="cost"
        value={formData.cost}
        onChange={handleInputChange}
        min="0"
        disabled={loading}
        required
      />

      <label>Description *</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        disabled={loading}
        required
      />

      <label>Rating (0-5) *</label>
      <input
        type="number"
        name="rating"
        value={formData.rating}
        onChange={handleInputChange}
        min="0"
        max="5"
        step="0.1"
        disabled={loading}
        required
      />

      <label>Meal Type *</label>
      <input
        name="meal_type"
        value={formData.meal_type}
        onChange={handleInputChange}
        disabled={loading}
        required
      />

      <label>Location *</label>
      <MapPicker
        initialPosition={{ lat: formData.location.coordinates[1], lng: formData.location.coordinates[0] }}
        onPositionChange={handleLocationSelect}
      />

      <MediaUploader
        media={formData.media}
        handleMediaChange={handleMediaChange}
        addMediaField={addMediaField}
        removeMediaField={removeMediaField}
        handleDeleteMedia={handleDeleteMedia}
        showCoverImage={false}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : initialData ? 'Update Restaurant' : 'Add Restaurant'}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default RestaurantForm;
