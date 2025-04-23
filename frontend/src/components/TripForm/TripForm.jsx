// import React from 'react';

// const TripForm = ({ tripData, handleInputChange }) => {
//   return (
//     <div className="form-section">
//       <h3>Trip Details</h3>
      
//       <div className="form-row">
//         <InputField 
//           name="title"
//           value={tripData.title}
//           onChange={handleInputChange}
//           placeholder="Title"
//           required
//         />
//         <InputField 
//           name="days"
//           type="number"
//           value={tripData.days}
//           onChange={handleInputChange}
//           placeholder="Days"
//           required
//         />
//         {/* Add other fields similarly */}
//       </div>

//       <textarea 
//         name="description"
//         value={tripData.description}
//         onChange={handleInputChange}
//         placeholder="Description"
//         required
//       />
//     </div>
//   );
// };

// const InputField = ({ name, type = 'text', ...props }) => (
//   <input
//     type={type}
//     name={name}
//     className="form-input"
//     {...props}
//   />
// );

// export default TripForm;

import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/TripForm.css';

function TripForm({ tripData, handleInputChange }) {
  return (
    <div className="trip-form">
      <h2>Trip Details</h2>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={tripData.title}
          onChange={handleInputChange}
          placeholder="Enter trip title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="days">Days</label>
        <input
          type="number"
          id="days"
          name="days"
          value={tripData.days || ''}
          onChange={handleInputChange}
          placeholder="Number of days"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="nights">Nights</label>
        <input
          type="number"
          id="nights"
          name="nights"
          value={tripData.nights || ''}
          onChange={handleInputChange}
          placeholder="Number of nights"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={tripData.description}
          onChange={handleInputChange}
          placeholder="Describe your trip"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="starting_location">Starting Location</label>
        <input
          type="text"
          id="starting_location"
          name="starting_location"
          value={tripData.starting_location}
          onChange={handleInputChange}
          placeholder="Enter starting location"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="cost">Cost</label>
        <input
          type="number"
          id="cost"
          name="cost"
          value={tripData.cost || ''}
          onChange={handleInputChange}
          placeholder="Estimated cost"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="best_time_to_visit">Best Time To Visit</label>
        <select
          id="best_time_to_visit"
          name="best_time_to_visit"
          value={tripData.best_time_to_visit}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a season</option>
          <option value="Summer">Summer</option>
          <option value="Winter">Winter</option>
          <option value="Spring">Spring</option>
          <option value="Autumn">Autumn</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="emergency_numbers">Emergency Numbers</label>
        <input
          type="text"
          id="emergency_numbers"
          name="emergency_numbers"
          value={tripData.emergency_numbers}
          onChange={handleInputChange}
          placeholder="Local emergency contacts"
        />
      </div>

      <div className="form-group">
        <label htmlFor="currency_used">Currency Used</label>
        <input
          type="text"
          id="currency_used"
          name="currency_used"
          value={tripData.currency_used}
          onChange={handleInputChange}
          placeholder="Currency, e.g., INR, USD"
        />
      </div>

      <div className="form-group">
        <label htmlFor="language_spoken">Language Spoken</label>
        <input
          type="text"
          id="language_spoken"
          name="language_spoken"
          value={tripData.language_spoken}
          onChange={handleInputChange}
          placeholder="Primary language(s)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="number_of_people">Number Of People</label>
        <input
          type="number"
          id="number_of_people"
          name="number_of_people"
          value={tripData.number_of_people || ''}
          onChange={handleInputChange}
          placeholder="Group size"
        />
      </div>
    </div>
  );
}

TripForm.propTypes = {
  tripData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    days: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    nights: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    starting_location: PropTypes.string,
    cost: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    best_time_to_visit: PropTypes.string,
    emergency_numbers: PropTypes.string,
    location: PropTypes.object,
    currency_used: PropTypes.string,
    language_spoken: PropTypes.string,
    number_of_people: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    places_visited: PropTypes.array,
    activities: PropTypes.array,
    hotels: PropTypes.array,
    restaurants: PropTypes.array,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default TripForm;
