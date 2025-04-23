
// // import React, { useEffect, useState } from "react";
// // import api from "../api"; // Assuming your API functions are here
// // import Card from '../components/Card'; // Import the reusable Card component

// // const Mytrips = () => {
// //   const [trips, setTrips] = useState([]);

// //   // Fetch trips data when the component mounts
// //   useEffect(() => {
// //     const fetchTrips = async () => {
// //       try {
// //         const response = await api.get("api/users/my-trips/"); // Replace with your correct API endpoint
// //         setTrips(response.data);
// //       } catch (error) {
// //         console.error("Error fetching trips:", error);
// //       }
// //     };
// //     fetchTrips();
// //   }, []);

// //   return (
// //     <div>
// //       <h1>My Trips</h1>
// //       <div className="trips-container">
// //         {trips.map((trip) => (
// //           <Card
// //             key={trip.id}
// //             title={trip.title}
// //             coverImage={trip.image_cover} // Correctly constructing the image URL
// //             tripId={trip.id}
// //           />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Mytrips;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // For navigation
// import api from "../api"; // Assuming your API functions are here
// import Card from "../components/Card"; // Import the reusable Card component

// const MyTrips = () => {
//   const [trips, setTrips] = useState([]);
//   const navigate = useNavigate();

//   // Fetch trips data when the component mounts
//   useEffect(() => {
//     const fetchTrips = async () => {
//       try {
//         const response = await api.get("api/users/my-trips/"); // Fetch user trips
//         setTrips(response.data);
//       } catch (error) {
//         console.error("Error fetching trips:", error);
//       }
//     };
//     fetchTrips();
//   }, []);

//   // Handle trip deletion (POST request with tripId in the URL)
//   const handleDelete = async (tripId) => {
//     if (!window.confirm("Are you sure you want to delete this trip?")) return;
  
//     try {
//       await api.delete(`/api/users/my-trips/${tripId}/`); // Use DELETE request
//       setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId)); // Update UI
//     } catch (error) {
//       console.error("Error deleting trip:", error);
//     }
//   };
  

//   return (
//     <div>
//       <h1>My Trips</h1>
//       { trips.length === 0 && <p>No trips found.</p> }
//       <div className="trips-container">
      
//           {trips.map((trip) => (
//             <div key={trip.id} className="trip-card">
//               <Card title={trip.title} coverImage={`${import.meta.env.VITE_API_URL}${trip.image_cover}`} tripId={trip.id} />
//               <div className="trip-actions">
//                 <button onClick={() => navigate(`/edit/${trip.id}`)} className="edit-btn">✏️ Edit</button>
//                 <button onClick={() => handleDelete(trip.id)} className="delete-btn">🗑️ Delete</button>
//               </div>
//             </div>
//           ))}
//       </div>


     
//     </div>
//   );
// };

// export default MyTrips;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import api from "../api"; // Assuming your API functions are here
import Card from "../components/Card"; // Import the reusable Card component
// Optional: Import a CSS file for styling this specific page
// import './MyTrips.css';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to store potential errors
  const navigate = useNavigate();

  // Fetch trips data when the component mounts
  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error state
      try {
        const response = await api.get("api/users/my-trips/"); // Fetch user trips
        setTrips(response.data); // Assuming the response structure contains a "trips" key
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Failed to load your trips. Please try again later."); // Set user-friendly error message
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };
    fetchTrips();
    console.log(trips)
    
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle trip deletion
  const handleDelete = async (tripId) => {
    // Enhanced confirmation message
    if (!window.confirm(`Are you sure you want to delete this trip? This action cannot be undone.`)) {
        return;
    }

    // Optional: Indicate deletion in progress (e.g., disable button, show spinner)
    // setError(null); // Reset error state if needed

    try {
      // Use DELETE request - ensure your API endpoint supports DELETE for this URL
      await api.delete(`/api/users/my-trips/${tripId}/`);
      // Update UI by removing the deleted trip from state
      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
      // Optional: Show a success message (e.g., using a toast notification library)
    } catch (err) {
      console.error("Error deleting trip:", err);
      // Set user-friendly error message (could be more specific based on API response)
      setError(`Failed to delete the trip (ID: ${tripId}). Please try again.`);
      // Optional: Show error message (e.g., using a toast notification library)
    } finally {
      // Optional: Re-enable button or hide spinner if used
    }
  };

  // --- Conditional Rendering Logic ---

  // Display loading indicator
  if (loading) {
    return <div>Loading your trips...</div>; // Replace with a spinner component if desired
  }

  // Display error message if fetching failed
  if (error && trips.length === 0) { // Show fetch error primarily if list is empty
      return <div>Error: {error}</div>;
  }

  // Display "No trips found" message
  if (!loading && trips.length === 0) {
    return (
        <div>
            <h1>My Trips</h1>
            <p>You haven't created any trips yet.</p>
            {/* Optional: Add a button to navigate to the create trip page */}
            {/* <button onClick={() => navigate('/create-trip')}>Create Your First Trip</button> */}
        </div>
    )
  }


  // --- Render Trips ---
  return (
    <div className="my-trips-page"> {/* Added a wrapper class for page-specific styling */}
      <h1>My Trips</h1>
      {/* Display deletion error without blocking the list */}
      {error && <p className="error-message">Error: {error}</p>}

      <div className="trips-container">
        {trips.map((trip) => (
          <div key={trip.id} className="trip-card">
             {/* Ensure Card component handles potential missing data gracefully */}
            <Card
                title={trip.title || "Untitled Trip"} // Provide fallback title
                // Construct cover image URL safely
                coverImage={trip.image_cover ? `${import.meta.env.VITE_API_URL}${trip.image_cover}` : "/path/to/default/image.jpg"} // Add default image
                tripId={trip.id}
            />
            <div className="trip-actions">
              {/* Use aria-label for icon buttons if text is removed */}
              <button
                onClick={() => navigate(`/edit/${trip.id}`)}
                className="edit-btn"
                aria-label={`Edit trip: ${trip.title || 'Untitled Trip'}`}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(trip.id)}
                className="delete-btn"
                aria-label={`Delete trip: ${trip.title || 'Untitled Trip'}`}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTrips;