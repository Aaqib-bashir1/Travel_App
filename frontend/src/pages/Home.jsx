
// import React, { useEffect, useState } from "react";
// import api from "../api"; // Assuming your API functions are here
// import Card from '../components/Card'; // Import the reusable Card component

// const HomePage = () => {
//   const [trips, setTrips] = useState([]);
//   const [searchQuery, setSearchQuery] = useState(""); // State for storing the search query
//   const [loading, setLoading] = useState(false); // State for loading indicator
//   const [error, setError] = useState(null); // State for errors

//   // Function to fetch trips, with different endpoints based on the context
//   const fetchTrips = async (query = "") => {
//     setLoading(true); // Set loading to true before the API call
//     try {
//       let url = "users/all_trips/"; // Default endpoint to fetch all trips
      
//       // If there is a search query, switch to the search endpoint
//       if (query) {
//         url = "users/trips/filter/"; // Your search-specific endpoint
//       }

//       // Make the API call, passing the search query as a parameter if provided
//       const response = await api.get(url, {
//         params: { search: query }, // Query parameter to filter trips
//       });

//       setTrips(response.data); // Update state with fetched trips
//       setError(null); // Clear any previous errors
//     } catch (error) {
//       setError("Error fetching trips."); // Set an error message if the API call fails
//       console.error("Error fetching trips:", error);
//     } finally {
//       setLoading(false); // Set loading to false after the API call completes
//     }
//   };

//   // Fetch trips when the component mounts (initially fetch all trips)
//   useEffect(() => {
//     fetchTrips(); // Fetch all trips initially (no query)
//   }, []);

//   // Handle the search button click
//   const handleSearch = () => {
//     fetchTrips(searchQuery); // Fetch trips with the current search query
//   };
//   const resetSearch = () => {
//     setSearchQuery(""); // Clear the search query
//     fetchTrips(); // Fetch all trips again
//   };

//   return (
//     <div>
//       <h1>All Trips</h1>
      
//       {/* Search Input */}
//       <div className="search-container">
//         <input
//           type="text"
//           value={searchQuery} // Bind input value to searchQuery state
//           onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
//           placeholder="Search for trips"
//         />
//         <button onClick={handleSearch} disabled={loading}>
//           {loading ? "Searching..." : "Search"}

//         </button>
//       </div>
      
//       {/* Error Message */}
//       {error && <div className="error-message">{error}</div>}

//       {/* Display the trips */}
//       <div className="trips-container">
//         {trips.length === 0 ? (
//           <p>No trips found.</p> // Show a message if no trips are available
//         ) : (
//           trips.map((trip) => (
//             <Card
//               key={trip.id}
//               title={trip.title}
//               coverImage={`http://localhost:8000${trip.image_cover}`} // Image URL construction
//               tripId={trip.id}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// import React, { useEffect, useState } from "react";
// import api from "../api"; // Assuming your API functions are here
// import Card from '../components/Card'; // Import the reusable Card component

// const HomePage = () => {
//   const [trips, setTrips] = useState([]);
//   const [searchQuery, setSearchQuery] = useState(""); // State for storing the search query
//   const [loading, setLoading] = useState(false); // State for loading indicator
//   const [error, setError] = useState(null); // State for errors

//   // Function to fetch trips, with different endpoints based on the context
//   const fetchTrips = async (query = "") => {
//     setLoading(true); // Set loading to true before the API call
//     try {
//       let url = "api/users/trips/"; // Default endpoint to fetch all trips
      
//       // If there is a search query, switch to the search endpoint
//       if (query) {
//         url = "users/trips/filter/"; // Your search-specific endpoint
//       }

//       // Make the API call, passing the search query as a parameter if provided
//       const response = await api.get(url, {
//         params: { search: query }, // Query parameter to filter trips
//       });

//       setTrips(response.data); // Update state with fetched trips
//       setError(null); // Clear any previous errors
//     } catch (error) {
//       setError("Error fetching trips."); // Set an error message if the API call fails
//       console.error("Error fetching trips:", error);
//     } finally {
//       setLoading(false); // Set loading to false after the API call completes
//     }
//   };

//   // Fetch trips when the component mounts (initially fetch all trips)
//   useEffect(() => {
//     fetchTrips(); // Fetch all trips initially (no query)
//   }, []);

//   // Handle the search button click
//   const handleSearch = () => {
//     fetchTrips(searchQuery); // Fetch trips with the current search query
//   };

//   // Handle the clear button click
//   const handleClear = () => {
//     setSearchQuery(""); // Clear the search query
//     fetchTrips(); // Fetch all trips again
//     const coverImage = `${api.defaults.baseURL}${trip.image_cover}`;
//   };

//   return (
//     <div>
//       <h1>All Trips</h1>
      
//       {/* Search Input */}
//       <div className="search-container">
//         <input
//           type="text"
//           value={searchQuery} // Bind input value to searchQuery state
//           onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
//           placeholder="Search for trips"
//         />
//         <button onClick={handleSearch} disabled={loading}>
//           {loading ? "Searching..." : "Search"}
//         </button>

//         {/* Clear Button */}
//         <button onClick={handleClear} disabled={loading}>
//           Clear
//         </button>
//       </div>
      
//       {/* Error Message */}
//       {error && <div className="error-message">{error}</div>}

//       {/* Display the trips */}
//       <div className="trips-container">
//         {trips.length === 0 ? (
//           <p>No trips found.</p> // Show a message if no trips are available
//         ) : (
//           trips.map((trip) => (
//             <Card
//               key={trip.id}
//               title={trip.title}
//               coverImage={trip.image_cover} // Image URL construction
//               tripId={trip.id}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;



import React, { useEffect, useState } from "react";
import api from "../api"; // API functions
import Card from '../components/Card'; // Reusable Card component
import LoadingSpinner from '../LoadingSpinner';

const HomePage = () => {
  const [trips, setTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch trips
  const fetchTrips = async (query = "") => {

    setLoading(true);
    try {
      const url = query ? "api/users/trips/filter/" : "api/users/trips/"; // Dynamic API endpoint
      

      const response = await api.get(url, { params: { search: query } });


      setTrips(response.data); // Update state
      setError(null); // Clear errors
    } catch (error) {
      setError("Error fetching trips.");
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all trips on component mount
  useEffect(() => {
    fetchTrips();
  }, []);

  // Handle search
  const handleSearch = () => {
    fetchTrips(searchQuery);
  };

  // Handle clear
  const handleClear = () => {
    setSearchQuery(""); // Reset search input
    fetchTrips(); // Fetch all trips again
  };

  return (
    <div>
      <h1>All Trips</h1>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for trips"
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
        <button onClick={handleClear} disabled={loading}>
          Clear
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Trips List */}
      <div className="trips-container">
        {trips.length === 0 ? (
          <p>No trips found.</p>
        ) : (
          trips.map((trip) => (
            <Card
              key={trip.id}
              title={trip.title}
              // coverImage={`{api.defaults}{trip.image_cover}`}// Correct image URL construction
              coverImage={`${import.meta.env.VITE_API_URL}${trip.image_cover}`}
              tripId={trip.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
