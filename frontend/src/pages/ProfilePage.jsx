// import React, { useState, useEffect } from "react";
// import api from "../api"; // Axios instance for API calls
// import ProfileCard from "../components/ProfileCard"; // ProfileCard component for UI
// import "../styles/ProfilePage.css";

// const ProfilePage = () => {
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   // Fetch profile data
//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const response = await api.get("/users/profile/"); // GET profile data
//         setProfileData(response.data);
//       } catch (err) {
//         setError("Failed to fetch profile data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfileData();
//   }, []);

//   // Handle profile picture update
//   const handleProfileUpdate = async (file) => {
//     setUploading(true);
//     const formData = new FormData();
//     formData.append("profile_picture", file);

//     try {
//       const response = await api.put("/users/profile/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Update profile data with new profile picture
//       setProfileData((prevData) => ({
//         ...prevData,
//         profile_picture: response.data.profile_picture,
//       }));
//     } catch (err) {
//       setError("Error uploading profile picture. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (loading) return <p>Loading profile...</p>;
//   if (error) return <p className="error">{error}</p>;

//   return (
//     <div className="profile-page">
//       <div className="profile-container">
//         <h1 className="profile-heading">Profile</h1>
//         {profileData && (
//           <ProfileCard
//             profileData={profileData}
//             onProfileUpdate={handleProfileUpdate}
//             uploading={uploading}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
import React, { useState, useEffect } from "react";
import api from "../api"; // Axios instance for API calls
import ProfileCard from "../components/ProfileCard"; // ProfileCard component for UI
import "../styles/ProfilePage.css";
// import "../styles/whole.css"
const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get("api/users/profile/"); // GET profile data
        setProfileData(response.data);
      } catch (err) {
        setError("Failed to fetch profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  // Handle profile picture update
  const handleProfileUpdate = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await api.put("api/users/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update profile data with the new profile picture
      setProfileData((prevData) => ({
        ...prevData,
        profile_picture: response.data.profile_picture, // Assuming response contains the updated image URL
      }));
    } catch (err) {
      setError("Error uploading profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-heading">Profile</h1>
        {profileData && (
          <ProfileCard
            profileData={profileData} // Pass updated profileData to ProfileCard
            onProfileUpdate={handleProfileUpdate}
            uploading={uploading}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

