

// import React, { useState, useEffect, useCallback } from 'react';
// import { data, useParams } from 'react-router-dom';
// import api from '../api';
// import TripForm from '../components/TripForm/TripForm';
// import MapPicker from '../components/TripForm/MapPicker';
// import ActivityForm from '../components/TripForm/ActivityForm';
// import HotelForm from '../components/TripForm/HotelForm';
// import RestaurantForm from '../components/TripForm/RestaurantForm';
// import PlaceForm from '../components/TripForm/PlaceForm';
// import MediaUploader from '../components/TripForm/MediaUploader';
// import '../styles/TripEdit.css';


// function TripEditPage() {
//   const { id } = useParams();
//   const [tripData, setTripData] = useState({
//     title: '',
//     description: '',
//     days: 0,
//     nights: 0,
//     starting_location: '',
//     cost: 0,
//     best_time_to_visit: '',
//     emergency_numbers: '',
//     location: { type: 'Point', coordinates: [0, 0] },
//     currency_used: '',
//     language_spoken: '',
//     number_of_people: 0,
//     places_visited: [],
//     activities: [],
//     hotels: [],
//     restaurants: [],
//     media: [],
//   });
//   const [coverImage, setCoverImage] = useState(null);
//   const [media, setMedia] = useState([]);
//   const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   // State to control which entity subform is visible (for add or edit)
//   const [editingEntities, setEditingEntities] = useState({
//     activities: null,
//     hotels: null,
//     restaurants: null,
//     places_visited: null,
//   });

//   // --- Fetch Trip Data ---
//   const fetchTripData = useCallback(async () => {
//     try {
//       const response = await api.get(`/api/users/my-trips/${id}/`);
//       const trip = response.data;

//       // Parse location coordinates (support string "POINT (lng lat)" or GeoJSON)
//       let lat = 0, lng = 0;
//       if (typeof trip.location === 'string') {
//         const coords = trip.location.match(/POINT \(([^)]+)\)/);
//         if (coords) [lng, lat] = coords[1].split(' ').map(Number);
//       } else if (trip.location?.coordinates) {
//         [lng, lat] = trip.location.coordinates;
//       }

//       // Convert numeric fields
//       const numberFields = ['days', 'nights', 'cost', 'number_of_people'];
//       const convertedTrip = Object.fromEntries(
//         Object.entries(trip).map(([key, value]) => [
//           key,
//           numberFields.includes(key) ? Number(value) || 0 : value,
//         ])
//       );

//       // Process media to ensure file URLs are absolute
//       const updatedMedia = (trip.media || []).map((item) => ({
//         ...item,
//         file: `${import.meta.env.VITE_API_URL}${item.file}`,
//       }));

//       setTripData({
//         ...convertedTrip,
//         location: { type: 'Point', coordinates: [lng, lat] },
//       });
//       setCoordinates({ lat, lng });
//       setCoverImage(`${trip.image_cover.replace(/^\/+/, '')}` );
//       setMedia(updatedMedia);
//     } catch (err) {
//       setError('Failed to fetch trip data');
//     }
//   }, [id]);

//   useEffect(() => {
//     fetchTripData();
//   }, [fetchTripData]);

//   // --- Handlers for Trip Metadata & Media ---
//   const handleInputChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setTripData((prev) => ({
//       ...prev,
//       [name]: ['days', 'nights', 'cost', 'number_of_people'].includes(name)
//         ? Number(value)
//         : value,
//     }));
//   }, []);

//   const handleCoverImageChange = useCallback((e) => {
//     setCoverImage(e.target.files[0]);
//   }, []);

//   const handleMediaChange = useCallback((e, index) => {
//     const { name, files, value } = e.target;
//     setMedia((prevMedia) => {
//       const newMedia = [...prevMedia];
//       newMedia[index] = {
//         ...newMedia[index],
//         [name]: name === 'file' ? files[0] : value,
//       };
//       return newMedia;
//     });
//   }, []);

//   const addMediaField = useCallback(() => {
//     setMedia((prevMedia) => [...prevMedia, { file: null, media_type: 'image', caption: '' }]);
//   }, []);

//   const removeMediaField = useCallback((index) => {
//     setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
//   }, []);

//   const handleDeleteMedia = async (mediaId) => {
//     try {
//       await api.delete(`/api/users/media/${mediaId}/`);
//       setSuccessMessage('Media deleted successfully!');
//       fetchTripData();
//     } catch (err) {
//       setError('Failed to delete media');
//     }
//   };

//   // --- Submit Updated Trip ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccessMessage('');

//     try {
//       const formData = new FormData();
//       // Append trip metadata (stringify arrays/objects)
//       Object.entries(tripData).forEach(([key, value]) => {
//         if (value !== '' && value !== null && value !== undefined) {
//           if (key === 'location' || Array.isArray(value)) {
//             formData.append(key, JSON.stringify(value));
//           } else {
//             formData.append(key, value);
//           }
//         }
//       });

//       if (coverImage && coverImage !== tripData.image_cover) {
//         formData.append('image_cover', coverImage);
//       }

//       media.forEach((mediaItem, index) => {
//         if (mediaItem.file && !mediaItem.id) {
//           formData.append(`media_files[${index}]`, mediaItem.file);
//         }
//       });

//       const response = await api.put(`/api/users/my-trips/${id}/`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       if (response.status === 200) {
//         setSuccessMessage('Trip updated successfully!');
//         fetchTripData();
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update trip');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Entity CRUD Handlers ---
//   // For creating a new entity
//   const handleAddEntity = async (type, data) => {
//     try {
//       const response = await api.post(`/api/users/${type}/`, { ...data, trip: id });
//       if (response.status === 201) {
//         setSuccessMessage(`${type.slice(0, -1)} added successfully!`);
//         // Clear any editing state for that type after adding
//         setEditingEntities((prev) => ({ ...prev, [type]: null }));
//         fetchTripData();
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || `Failed to add ${type}`);
//     }
//   };

//   // For updating an existing entity
//   const handleUpdateEntity = async (type, data, entityId) => {
//     try {
//       const response = await api.put(`/api/users/${type}/${entityId}/`, { ...data, trip: id });
//       if (response.status === 200) {
//         setSuccessMessage(`${type.slice(0, -1)} updated successfully!`);
//         setEditingEntities((prev) => ({ ...prev, [type]: null }));
//         fetchTripData();
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || `Failed to update ${type.slice(0, -1)}`);
//     }
//   };

//   // For deleting an entity
//   const handleDeleteEntity = async (type, entityId) => {
//     try {
//       const response = await api.delete(`/api/users/${type}/${entityId}/`);
//       if (response.status === 204) {
//         setSuccessMessage(`${type.slice(0, -1)} deleted successfully!`);
//         fetchTripData();
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || `Failed to delete ${type.slice(0, -1)}`);
//     }
//   };

//   // Set the given entity into editing mode so its data populates the corresponding subform
//   const handleEditEntity = (type, entity) => {
//     setEditingEntities((prev) => ({ ...prev, [type]: entity }));
//   };

//   // --- Render ---
//   return (
//     <div className="trip-edit-page container">
//       <h1>Edit Trip</h1>
//       {error && <div className="error-message">{error}</div>}
//       {successMessage && <div className="success-message">{successMessage}</div>}

//       <form onSubmit={handleSubmit} className="trip-edit-form">
//         <TripForm tripData={tripData} handleInputChange={handleInputChange} />

//         <div className="form-section">
//           <h3>Media</h3>
//           <MediaUploader
//             coverImage={coverImage}
//             media={media}
//             handleCoverImageChange={handleCoverImageChange}
//             handleMediaChange={handleMediaChange}
//             addMediaField={addMediaField}
//             removeMediaField={removeMediaField}
//             handleDeleteMedia={handleDeleteMedia}
//           />
//         </div>

//         <div className="form-section">
//           <h3>Location</h3>
//           <MapPicker
//             initialPosition={coordinates}
//             onPositionChange={(newCoords) => {
//               setCoordinates(newCoords);
//               setTripData((prev) => ({
//                 ...prev,
//                 location: { type: 'Point', coordinates: [newCoords.lng, newCoords.lat] },
//               }));
//             }}
//           />
//         </div>

//         <button type="submit" className="submit-button" disabled={loading}>
//           {loading ? 'Updating...' : 'Update Trip'}
//         </button>
//       </form>

//       {/* --- Existing Entities Preview --- */}
//       <div className="entity-lists">
//         <h3>Existing Entities</h3>
//         {['activities', 'hotels', 'restaurants', 'places_visited'].map((type) => (
//           <div key={type} className="entity-list">
//             <h4>{type.replace(/_/g, ' ').toUpperCase()}</h4>
//             {tripData[type] && tripData[type].length > 0 ? (
//               tripData[type].map((entity) => (
//                 <div key={entity.id} className="entity-item">
//                   {/* Only show title (or name) and description */}
//                   <p>
//                     <strong>{entity.title || entity.name || 'No Title'}</strong>
//                   </p>
//                   <p>{entity.description || 'No Description'}</p>
//                   <button onClick={() => handleEditEntity(type, entity)} className="edit-button">
//                     Edit
//                   </button>
//                   <button onClick={() => handleDeleteEntity(type, entity.id)} className="delete-button">
//                     Delete
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <p>No {type.replace(/_/g, ' ')} added.</p>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* --- Entity Subforms (Conditional) --- */}
//       <div className="entity-forms">
//         {/* Activities */}
//         <div className="entity-form activities-form">
//           {editingEntities.activities !== null ? (
//             <ActivityForm
//               initialData={editingEntities.activities}
//               onSubmit={(data) => {
//                 if (editingEntities.activities && editingEntities.activities.id) {
//                   handleUpdateEntity('activities', data, editingEntities.activities.id);
//                 } else {
//                   handleAddEntity('activities', data);
//                 }
//               }}
//               onCancel={() =>
//                 setEditingEntities((prev) => ({ ...prev, activities: null }))
//               }
//             />
//           ) : (
//             <button
//               onClick={() => setEditingEntities((prev) => ({ ...prev, activities: {} }))}
//             >
//               Add New Activity
//             </button>
//           )}
//         </div>
//         {/* Hotels */}
//         <div className="entity-form hotels-form">
//           {editingEntities.hotels !== null ? (
//             <HotelForm
//               initialData={editingEntities.hotels}
//               onSubmit={(data) => {
//                 if (editingEntities.hotels && editingEntities.hotels.id) {
//                   handleUpdateEntity('hotels', data, editingEntities.hotels.id);
//                 } else {
//                   handleAddEntity('hotels', data);
//                 }
//               }}
//               onCancel={() =>
//                 setEditingEntities((prev) => ({ ...prev, hotels: null }))
//               }
//             />
//           ) : (
//             <button
//               onClick={() => setEditingEntities((prev) => ({ ...prev, hotels: {} }))}
//             >
//               Add New Hotel
//             </button>
//           )}
//         </div>
//         {/* Restaurants */}
//         <div className="entity-form restaurants-form">
//           {editingEntities.restaurants !== null ? (
//             <RestaurantForm
//               initialData={editingEntities.restaurants}
//               onSubmit={(data) => {
//                 if (editingEntities.restaurants && editingEntities.restaurants.id) {
//                   handleUpdateEntity('restaurants', data, editingEntities.restaurants.id);
//                 } else {
//                   handleAddEntity('restaurants', data);
//                 }
//               }}
//               onCancel={() =>
//                 setEditingEntities((prev) => ({ ...prev, restaurants: null }))
//               }
//             />
//           ) : (
//             <button
//               onClick={() => setEditingEntities((prev) => ({ ...prev, restaurants: {} }))}
//             >
//               Add New Restaurant
//             </button>
//           )}
//         </div>
//         {/* Places Visited */}
//         <div className="entity-form places-form">
//           {editingEntities.places_visited !== null ? (
//             <PlaceForm
//               initialData={editingEntities.places_visited}
//               onSubmit={(data) => {
//                 if (editingEntities.places_visited && editingEntities.places_visited.id) {
//                   handleUpdateEntity('places-visited', data, editingEntities.places_visited.id);
//                 } else {
//                   handleAddEntity('places-visited', data);
//                 }
//               }}
//               onCancel={() =>
//                 setEditingEntities((prev) => ({ ...prev, places_visited: null }))
//               }
//             />
//           ) : (
//             <button
//               onClick={() =>
//                 setEditingEntities((prev) => ({ ...prev, places_visited: {} }))
//               }
//             >
//               Add New Place
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TripEditPage;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import TripForm from '../components/TripForm/TripForm';
import MapPicker from '../components/TripForm/MapPicker';
import ActivityForm from '../components/TripForm/ActivityForm';
import HotelForm from '../components/TripForm/HotelForm';
import RestaurantForm from '../components/TripForm/RestaurantForm';
import PlaceForm from '../components/TripForm/PlaceForm';
import MediaUploader from '../components/TripForm/MediaUploader';
import '../styles/TripEdit.css';

function TripEditPage() {
  const { id } = useParams();
  const [tripData, setTripData] = useState({
    title: '',
    description: '',
    days: 0,
    nights: 0,
    starting_location: '',
    cost: 0,
    best_time_to_visit: '',
    emergency_numbers: '',
    location: { type: 'Point', coordinates: [0, 0] },
    currency_used: '',
    language_spoken: '',
    number_of_people: 0,
    places_visited: [],
    activities: [],
    hotels: [],
    restaurants: [],
    media: [],
  });
  const [coverImage, setCoverImage] = useState(null);
  const [media, setMedia] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // State to control which entity subform is visible (for add or edit)
  const [editingEntities, setEditingEntities] = useState({
    activities: null,
    hotels: null,
    restaurants: null,
    places_visited: null,
  });

  // Helper to map state keys to API endpoints.
  const getEntityEndpoint = (type) => {
    if (type === 'places_visited') return 'places-visited';
    return type;
  };

  // --- Fetch Trip Data ---
  const fetchTripData = useCallback(async () => {
    try {
      const response = await api.get(`/api/users/my-trips/${id}/`);
      const trip = response.data;

      // Parse location coordinates (supports "POINT (lng lat)" string or GeoJSON)
      let lat = 0, lng = 0;
      if (typeof trip.location === 'string') {
        const coords = trip.location.match(/POINT \(([^)]+)\)/);
        if (coords) [lng, lat] = coords[1].split(' ').map(Number);
      } else if (trip.location?.coordinates) {
        [lng, lat] = trip.location.coordinates;
      }

      // Convert numeric fields
      const numberFields = ['days', 'nights', 'cost', 'number_of_people'];
      const convertedTrip = Object.fromEntries(
        Object.entries(trip).map(([key, value]) => [
          key,
          numberFields.includes(key) ? Number(value) || 0 : value,
        ])
      );

      // Process media to ensure file URLs are absolute
      const updatedMedia = (trip.media || []).map((item) => ({
        ...item,
        file: `${import.meta.env.VITE_API_URL}${item.file}`,
      }));

      setTripData({
        ...convertedTrip,
        location: { type: 'Point', coordinates: [lng, lat] },
      });
      setCoordinates({ lat, lng });
      setCoverImage(
        trip.image_cover
          ? `${import.meta.env.VITE_API_URL}${trip.image_cover}`
          : null
      );
      setMedia(updatedMedia);
    } catch (err) {
      setError('Failed to fetch trip data');
    }
  }, [id]);

  useEffect(() => {
    fetchTripData();
  }, [fetchTripData]);

  // --- Handlers for Trip Metadata & Media ---
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setTripData((prev) => ({
      ...prev,
      [name]: ['days', 'nights', 'cost', 'number_of_people'].includes(name)
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
    setMedia((prevMedia) => [
      ...prevMedia,
      { file: null, media_type: 'image', caption: '' },
    ]);
  }, []);

  const removeMediaField = useCallback((index) => {
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
  }, []);

  const handleDeleteMedia = async (mediaId) => {
    try {
      await api.delete(`/api/users/media/${mediaId}/`);
      setSuccessMessage('Media deleted successfully!');
      fetchTripData();
    } catch (err) {
      setError('Failed to delete media');
    }
  };

  // --- Submit Updated Trip ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      // Append trip metadata (stringify arrays/objects)
      Object.entries(tripData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          if (key === 'location' || Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      // Always append the cover image if it exists,
      // even if it's not updated, since the update endpoint requires it.
      if (coverImage) {
        formData.append('image_cover', coverImage);
      }

      // Append new media files (only those without an id)
      media.forEach((mediaItem, index) => {
        if (mediaItem.file && !mediaItem.id) {
          formData.append(`media_files[${index}]`, mediaItem.file);
        }
      });

      const response = await api.put(`/api/users/my-trips/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        setSuccessMessage('Trip updated successfully!');
        fetchTripData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update trip');
    } finally {
      setLoading(false);
    }
  };

  // --- Entity CRUD Handlers ---
  const handleAddEntity = async (type, data) => {
    try {
      const endpoint = getEntityEndpoint(type);
      // Build payload including trip FK
      const payload = { ...data, trip: id };
      // If there's a GeoJSON location, convert to WKT POINT string
      if (data.location?.coordinates) {
        const [lng, lat] = data.location.coordinates;
        payload.location = `POINT(${lng} ${lat})`;
      }

      const response = await api.post(`/api/users/${endpoint}/`, payload);
      if (response.status === 201) {
        setSuccessMessage(`${type.slice(0, -1)} added successfully!`);
        setEditingEntities(prev => ({ ...prev, [type]: null }));
        fetchTripData();
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to add ${type}`);
    }
  };

  // Generic handler for updating entities, also converting location
  const handleUpdateEntity = async (type, data, entityId) => {
    try {
      const endpoint = getEntityEndpoint(type);
      const payload = { ...data, trip: id };
      if (data.location?.coordinates) {
        const [lng, lat] = data.location.coordinates;
        payload.location = `POINT(${lng} ${lat})`;
      }
      const response = await api.put(`/api/users/${endpoint}/${entityId}/`, payload);
      if (response.status === 200) {
        setSuccessMessage(`${type.slice(0, -1)} updated successfully!`);
        setEditingEntities(prev => ({ ...prev, [type]: null }));
        fetchTripData();
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to update ${type.slice(0, -1)}`);
    }
  };


  const handleDeleteEntity = async (type, entityId) => {
    try {
      const endpoint = getEntityEndpoint(type);
      const response = await api.delete(`/api/users/${endpoint}/${entityId}/`);
      if (response.status === 204) {
        setSuccessMessage(`${type.slice(0, -1)} deleted successfully!`);
        fetchTripData();
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to delete ${type.slice(0, -1)}`);
    }
  };

  const handleEditEntity = (type, entity) => {
    setEditingEntities((prev) => ({ ...prev, [type]: entity }));
  };

  // --- Render ---
  return (
    <div className="trip-edit-page container">
      <h1>Edit Trip</h1>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="trip-edit-form">
        <TripForm tripData={tripData} handleInputChange={handleInputChange} />

        <div className="form-section">
          <h3>Media</h3>
          <MediaUploader
            coverImage={coverImage}
            media={media}
            handleCoverImageChange={handleCoverImageChange}
            handleMediaChange={handleMediaChange}
            addMediaField={addMediaField}
            removeMediaField={removeMediaField}
            handleDeleteMedia={handleDeleteMedia}
          />
        </div>

        <div className="form-section">
          <h3>Location</h3>
          <MapPicker
            initialPosition={coordinates}
            onPositionChange={(newCoords) => {
              setCoordinates(newCoords);
              setTripData((prev) => ({
                ...prev,
                location: { type: 'Point', coordinates: [newCoords.lng, newCoords.lat] },
              }));
            }}
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Updating...' : 'Update Trip'}
        </button>
      </form>

      {/* --- Existing Entities Preview --- */}
      <h3>Existing Entities</h3>
      <div className="entity-lists">
        
        {['activities', 'hotels', 'restaurants', 'places_visited'].map((type) => (
          <div key={type} className="entity-list">
            <h4>{type.replace(/_/g, ' ').toUpperCase()}</h4>
            {tripData[type] && tripData[type].length > 0 ? (
              tripData[type].map((entity) => (
                <div key={entity.id} className="entity-item">
                  <p>
                    <strong>{entity.title || entity.name || 'No Title'}</strong>
                  </p>
                  <p>{entity.description || 'No Description'}</p>
                  <button onClick={() => handleEditEntity(type, entity)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteEntity(type, entity.id)} className="delete-button">
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No {type.replace(/_/g, ' ')} added.</p>
            )}
          </div>
        ))}
      </div>

      {/* --- Entity Subforms (Conditional) --- */}
      <div className="entity-forms">
        {/* Activities */}
        <div className="entity-form activities-form">
          {editingEntities.activities !== null ? (
            <ActivityForm
              initialData={editingEntities.activities}
              tripId={id}
              onSubmit={(data) => {
                if (editingEntities.activities && editingEntities.activities.id) {
                  handleUpdateEntity('activities', data, editingEntities.activities.id);
                } else {
                  handleAddEntity('activities', data);
                }
              }}
              onCancel={() =>
                setEditingEntities((prev) => ({ ...prev, activities: null }))
              }
            />
          ) : (
            <button
              onClick={() => setEditingEntities((prev) => ({ ...prev, activities: {} }))}
            >
              Add New Activity
            </button>
          )}
        </div>
        {/* Hotels */}
        <div className="entity-form hotels-form">
          {editingEntities.hotels !== null ? (
            <HotelForm
              initialData={editingEntities.hotels}
              tripId={id}
              onSubmit={(data) => {
                if (editingEntities.hotels && editingEntities.hotels.id) {
                  handleUpdateEntity('hotels', data, editingEntities.hotels.id);
                } else {
                  handleAddEntity('hotels', data);
                }
              }}
              onCancel={() =>
                setEditingEntities((prev) => ({ ...prev, hotels: null }))
              }
            />
          ) : (
            <button
              onClick={() => setEditingEntities((prev) => ({ ...prev, hotels: {} }))}
            >
              Add New Hotel
            </button>
          )}
        </div>
        {/* Restaurants */}
        <div className="entity-form restaurants-form">
          {editingEntities.restaurants !== null ? (
            <RestaurantForm
              initialData={editingEntities.restaurants}
              tripId={id}
              onSubmit={(data) => {
                if (editingEntities.restaurants && editingEntities.restaurants.id) {
                  handleUpdateEntity('restaurants', data, editingEntities.restaurants.id);
                } else {
                  handleAddEntity('restaurants', data);
                }
              }}
              onCancel={() =>
                setEditingEntities((prev) => ({ ...prev, restaurants: null }))
              }
            />
          ) : (
            <button
              onClick={() => setEditingEntities((prev) => ({ ...prev, restaurants: {} }))}
            >
              Add New Restaurant
            </button>
          )}
        </div>
        {/* Places Visited */}
        <div className="entity-form places-form">
          {editingEntities.places_visited !== null ? (
            <PlaceForm
              initialData={editingEntities.places_visited}
              tripId={id}
              onSubmit={(data) => {
                if (editingEntities.places_visited && editingEntities.places_visited.id) {
                  handleUpdateEntity('places_visited', data, editingEntities.places_visited.id);
                } else {
                  handleAddEntity('places_visited', data);
                }
              }}
              onCancel={() =>
                setEditingEntities((prev) => ({ ...prev, places_visited: null }))
              }
            />
          ) : (
            <button
              onClick={() =>
                setEditingEntities((prev) => ({ ...prev, places_visited: {} }))
              }
            >
              Add New Place
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripEditPage;
