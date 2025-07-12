import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import ToggleButtons from '../components/Tripcards/ToggleButtons';
import InfoCard from '../components/Tripcards/InfoCard';
import ImageGallery from '../components/Tripcards/ImageGallery';
import { GoogleMapLink } from '../components/Tripcards/LocationLink';  // Import GoogleMapLink
import "../styles/TripDetailsPage.css";

const TripDetailPage = () => {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('places_visited');

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await api.get(`/api/users/trips/${tripId}`);
        if (response.status !== 200) throw new Error('Failed to fetch trip data');
        const data = response.data;
        setTripData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTripData();
  }, [tripId]);

  if (loading) return <p>Loading trip details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!tripData) return <p>No trip data available.</p>;

  return (
    <div className="trip-detail-page">
      {/* Cover Image */}
      <div className="cover-image">
        <img src={`${import.meta.env.VITE_API_URL}${tripData.image_cover}`} alt="Cover" />
      </div>
    <div className="trip-grid">
      {/* Trip Details */}
      <div className="trip-details">
        <h1>{tripData.title}</h1>
        <p><strong>Description:</strong> {tripData.description}</p>
        <p><strong>Duration:</strong> {tripData.days} days, {tripData.nights} nights</p>
        <p><strong>Starting Location:</strong> {tripData.starting_location}</p>
        <p><strong>Cost:</strong> ₹{tripData.cost}</p>
        <p><strong>Best Time to Visit:</strong> {tripData.best_time_to_visit}</p>
        <p><strong>Emergency Numbers:</strong> {tripData.emergency_numbers}</p>
        <p><strong>Currency Used:</strong> {tripData.currency_used}</p>
        <p><strong>Language Spoken:</strong> {tripData.language_spoken}</p>
        <p><strong>Number of People:</strong> {tripData.number_of_people}</p>
        <GoogleMapLink coordinates={tripData.location} />  {/* Use GoogleMapLink component for coordinates */}
      </div>

      {/* Media Slideshow */}
      <div className='trip-deatil-slideshow'>
        {tripData.media && tripData.media.length > 0 && (
          <ImageGallery 
            media={tripData.media.map(item => ({
              ...item,
              file: `${import.meta.env.VITE_API_URL}${item.file}`  // Update 'file' to be a full URL
            }))}
            galleryWidth="800px"
          />
        )}
      </div>
      </div>

      {/* Toggle Buttons */}
      <ToggleButtons activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Collapsible Cards Container */}
      <div className="trips-container">
        {tripData[activeSection]?.map((item, index) => {
          // Convert media file URLs to full URLs for each item
          const updatedMedia = item.media?.map(mediaItem => ({
            ...mediaItem,
            file: `${import.meta.env.VITE_API_URL}${mediaItem.file}`  // Update 'file' to be a full URL
          }));

          return (
            <InfoCard 
              key={index} 
              data={{
                ...item,
                media: updatedMedia,  // Full URLs for media
                googleMapsLink: item.coordinates ? <GoogleMapLink coordinates={item.coordinates} /> : null  // Use GoogleMapLink component for coordinates
              }} 
              type={activeSection} 
            />
          );
        })}
      </div>
    </div>
  );
};

export default TripDetailPage;
