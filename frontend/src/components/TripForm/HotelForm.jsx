// import React, { useState, useEffect } from 'react';
// import MapPicker from './MapPicker';

// function HotelForm({ initialData = null, onSubmit, onCancel }) {
//   const [hotelData, setHotelData] = useState({
//     name: initialData?.name || '',
//     cost: initialData?.cost || '',
//     description: initialData?.description || '',
//     rating: initialData?.rating || '',
//     rooms_booked: initialData?.rooms_booked || '',
//     media: initialData?.media || [],
//     // coordinates stored as an object { lat, lng }
//     coordinates: initialData?.coordinates || { lat: 0, lng: 0 },
//   });

//   useEffect(() => {
//     if (initialData) {
//       setHotelData({
//         name: initialData.name || '',
//         cost: initialData.cost || '',
//         description: initialData.description || '',
//         rating: initialData.rating || '',
//         rooms_booked: initialData.rooms_booked || '',
//         media: initialData.media || [],
//         coordinates: initialData.coordinates || { lat: 0, lng: 0 },
//       });
//     } else {
//       setHotelData({
//         name: '',
//         cost: '',
//         description: '',
//         rating: '',
//         rooms_booked: '',
//         media: [],
//         coordinates: { lat: 0, lng: 0 },
//       });
//     }
//   }, [initialData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setHotelData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleMediaChange = (e) => {
//     const files = Array.from(e.target.files);
//     setHotelData((prev) => ({ ...prev, media: [...prev.media, ...files] }));
//   };

//   const handleCoordinatesChange = (newCoords) => {
//     setHotelData((prev) => ({ ...prev, coordinates: newCoords }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(hotelData);
//     if (!initialData) {
//       setHotelData({
//         name: '',
//         cost: '',
//         description: '',
//         rating: '',
//         rooms_booked: '',
//         media: [],
//         coordinates: { lat: 0, lng: 0 },
//       });
//     }
//   };

//   return (
//     <div className="hotel-form">
//       <h3>{initialData ? 'Edit Hotel' : 'Add Hotel'}</h3>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Name:</label>
//           <input 
//             type="text" 
//             name="name" 
//             value={hotelData.name} 
//             onChange={handleInputChange} 
//             required 
//           />
//         </div>
//         <div>
//           <label>Cost:</label>
//           <input 
//             type="number" 
//             name="cost" 
//             value={hotelData.cost} 
//             onChange={handleInputChange} 
//             required 
//           />
//         </div>
//         <div>
//           <label>Description:</label>
//           <textarea 
//             name="description" 
//             value={hotelData.description} 
//             onChange={handleInputChange} 
//             required 
//           />
//         </div>
//         <div>
//           <label>Rating:</label>
//           <input 
//             type="number" 
//             name="rating" 
//             value={hotelData.rating} 
//             onChange={handleInputChange} 
//             required 
//           />
//         </div>
//         <div>
//           <label>Rooms Booked:</label>
//           <input 
//             type="number" 
//             name="rooms_booked" 
//             value={hotelData.rooms_booked} 
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
//             initialPosition={hotelData.coordinates} 
//             onPositionChange={handleCoordinatesChange} 
//           />
//         </div>
//         <button type="submit">
//           {initialData ? 'Update Hotel' : 'Add Hotel'}
//         </button>
//         {onCancel && (
//           <button type="button" onClick={onCancel}>Cancel</button>
//         )}
//       </form>
//     </div>
//   );
// }

// export default HotelForm;
// src/components/TripForm/HotelForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';
import MapPicker from './MapPicker';
import MediaUploader from './MediaUploader';

const HotelForm = ({ initialData = null, onSubmit, onCancel, tripId }) => {
  const [formData, setFormData] = useState({
    name: '',
    cost: 0,
    description: '',
    rating: 0,
    rooms_booked: 0,
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
        rooms_booked: initialData.rooms_booked || 0,
        location: initialData.location || { type: 'Point', coordinates: [0, 0] },
        media: initialData.media?.map(m => ({ ...m, file: m.file_url, cover_image: false })) || []
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['cost','rating','rooms_booked'].includes(name) ? Number(value) : value
    }));
  };

  const handleLocationSelect = (coords) => {
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

  const removeMediaField = (idx) => setFormData(prev => ({
    ...prev,
    media: prev.media.filter((_, i) => i !== idx)
  }));

  const handleDeleteMedia = async (id) => {
    try {
      await api.delete(`/api/users/media/${id}/`);
      setFormData(prev => ({ ...prev, media: prev.media.filter(m => m.id !== id) }));
    } catch {
      setError('Failed to delete media');
    }
  };

  const uploadHotelMedia = async (hotelId) => {
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
        await api.post(`/api/users/hotels/${hotelId}/media/`, fd);
      }
    }
  };

  const validate = () => {
    if (!formData.name.trim()) return setError('Name is required'), false;
    if (formData.cost < 0) return setError('Cost must be non-negative'), false;
    if (!formData.description.trim()) return setError('Description is required'), false;
    if (formData.rating < 0 || formData.rating > 5) return setError('Rating between 0 and 5'), false;
    if (formData.rooms_booked < 0) return setError('Rooms booked must be non-negative'), false;
    if (!formData.location.coordinates.every(Number.isFinite)) return setError('Valid location required'), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);

    try {
      const { location, media: _, ...rest } = formData;
      const [lng, lat] = location.coordinates;
      const locationWkt = `POINT(${lng} ${lat})`;
      const payload = { ...rest, location: locationWkt, trip: tripId };

      const isEdit = Boolean(initialData?.id);
      const url = isEdit ? `/api/users/hotels/${initialData.id}/` : '/api/users/hotels/';
      const res = isEdit ? await api.put(url, payload) : await api.post(url, payload);

      await uploadHotelMedia(res.data.id);
      const fresh = await api.get(`/api/users/hotels/${res.data.id}/`);
      onSubmit(fresh.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving hotel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hotel-form">
      <h3>{initialData ? 'Edit Hotel' : 'Add Hotel'}</h3>
      {error && <div className="error-message">{error}</div>}
      <label>Name *</label>
      <input name="name" value={formData.name} onChange={handleInputChange} disabled={loading} required />

      <label>Cost *</label>
      <input type="number" name="cost" value={formData.cost} onChange={handleInputChange} min="0" disabled={loading} required />

      <label>Description *</label>
      <textarea name="description" value={formData.description} onChange={handleInputChange} disabled={loading} required />

      <label>Rating (0-5) *</label>
      <input type="number" name="rating" value={formData.rating} onChange={handleInputChange} min="0" max="5" step="0.1" disabled={loading} required />

      <label>Rooms Booked *</label>
      <input type="number" name="rooms_booked" value={formData.rooms_booked} onChange={handleInputChange} min="0" disabled={loading} required />

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
        {loading ? 'Saving...' : initialData ? 'Update Hotel' : 'Add Hotel'}
      </button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default HotelForm;
