import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Card.css";

const Card = ({ title, coverImage, tripId }) => {
  return (
    <div className="trip-card">
      <Link to={`/trip/${tripId}`} className="trip-link">
        <img
          src={coverImage || "/path/to/default-image.jpg"} // Fallback image if coverImage is missing
          alt={title}
          className="trip-cover-image"
        />
        <h2>{title}</h2>
      </Link>
    </div>
  );
};

export default Card;
