import React, { useState } from 'react';
import { GoogleMapLink } from './LocationLink';
import ImageGallery from './ImageGallery';
import "../../styles/InfoCard.css"; // Import the same styles as your Card component

const InfoCard = ({ data, type }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Toggle the visibility of the card details
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Generic render function for fields
  const renderField = (label, value) => {
    return value == null || value === '' ? (
      <p><strong>{label}:</strong> Not available</p>
    ) : (
      <p><strong>{label}:</strong> {value}</p>
    );
  };

  // Function to render type-specific fields
  const renderTypeSpecificFields = () => {
    switch (type) {
      case 'places_visited':
      case 'activities':
      // Handle restaurant-specific fields
        return (
          <>
            {renderField('Description', data.description)}
            {renderField('Cost', `₹${data.cost}`)}
            {renderField('Best Time to Visit', data.best_time_to_visit)}
            {data.coordinates && <GoogleMapLink coordinates={data.coordinates} />}
            
          </>
        );
      case 'restaurants': 
      case 'hotels': // Handle hotel-specific fields
        return (
          <>
            {renderField('Description', data.description)}
            {renderField('Cost', `₹${data.cost}`)}
            {renderField('Rating', data.rating)}
            {type === 'restaurants' && renderField(' Meal Type', data.meal_type) } {/* Specific to restaurants */}
            {type === 'hotels' && renderField('Rooms Booked', data.rooms_booked)}
            {data.coordinates && <GoogleMapLink coordinates={data.coordinates} />}
          </>
        );
      default:
        return null;
    }
  };

  // Extract the cover image (if exists)
  const coverImage = data.media && data.media[0]?.file;

  return (
    <div className="trip-card" onClick={toggleCollapse}>
      <div className="trip-link">
        {/* Cover Image */}
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover"
            className="trip-cover-image"
          />
        )}

        {/* Title */}
        <h2>{data.name || 'No name available'}</h2>

        {/* Collapsible Details */}
        {!isCollapsed && (
          <div className="card-details">
            {/* Render type-specific fields */}
            {renderTypeSpecificFields()}

            {/* Render Image Gallery if media is available */}
            {data.media && data.media.length > 0 && (
              <ImageGallery
                media={data.media}
                width="100%"  // Pass dynamic width (100% of the container)
                height="auto" // Adjust the height based on the container height
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
