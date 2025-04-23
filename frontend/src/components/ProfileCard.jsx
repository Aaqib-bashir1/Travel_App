
// import React, { useState, useRef, useCallback } from "react";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";
// // import "../styles/ProfileCard.css";

// const ProfileCard = ({ profileData, onProfileUpdate, uploading }) => {
//   const [file, setFile] = useState(null);
//   const [imageSrc, setImageSrc] = useState(profileData.profile_picture || '/images/default-profile.jpg');
//   const [croppedImage, setCroppedImage] = useState(null);  // To hold cropped image data URL
//   const cropperRef = useRef(null);

//   // Handle file selection
//   const handleFileChange = useCallback((e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImageSrc(reader.result); // Show the selected image
//       };
//       reader.readAsDataURL(selectedFile);
//     }
//   }, []);

//   // Handle cropping logic
//   const handleCrop = useCallback(() => {
//     if (cropperRef.current && cropperRef.current.cropper) {
//       const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
//         width: 200,  // You can adjust this to desired crop size
//         height: 200, // You can adjust this to desired crop size
//       });
//       setCroppedImage(croppedCanvas.toDataURL());  // Save the cropped image as data URL
//     }
//   }, []);

//   // Submit the cropped image to the parent component
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (file) {
//       onProfileUpdate(file);  // Submit the original file if no crop
//     } else if (croppedImage) {
//       // If there's a cropped image, convert it to a Blob and upload
//       const blob = dataURLToBlob(croppedImage);
//       onProfileUpdate(blob);  // Submit the cropped image
     
  
//         }
//     }   

//   // Utility function to convert data URL to Blob
//   const dataURLToBlob = (dataURL) => {
//     const byteString = atob(dataURL.split(',')[1]);
//     const arrayBuffer = new ArrayBuffer(byteString.length);
//     const uintArray = new Uint8Array(arrayBuffer);

//     for (let i = 0; i < byteString.length; i++) {
//       uintArray[i] = byteString.charCodeAt(i);
//     }

//     return new Blob([uintArray], { type: 'image/png' });
//   };

//   // Dynamically select whether to show the cropped or original image
//   const imageUrl = croppedImage || imageSrc;

//   return (
//     <div className="profile-card">
//       <div
//         className="profile-picture-container"
//         style={{
//           position: "relative", 
//           display: "inline-block", 
//           width: 200, 
//           height: 200,
//         }}
//       >
//         {/* Circular profile picture */}
//         <img
//           src={`http://127.0.0.1:8000${imageUrl}`}  // Correct image URL path
//           alt={`${profileData.username}'s profile`}
//           className="profile-picture"
//           style={{
//             borderRadius: "50%",  // Make the profile picture circular
//             width: "100%",        // Ensure the image takes full width
//             height: "100%",       // Ensure the image takes full height
//             objectFit: "cover",   // Ensure the image covers the circle area
//           }}
//         />

//         {/* Cropper Section (appears only when a file is selected) */}
//         {file && (
//           <div
//             className="cropper-container"
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "100%",
//               borderRadius: "50%", // Make the cropper circular
//               overflow: "hidden",  // Clip the cropper to the circular shape
//             }}
//           >
//             <Cropper
//               src={imageSrc}
//               style={{ width: "100%", height: "100%" }}
//               initialAspectRatio={1}
//               aspectRatio={1}
//               guides={false}
//               ref={cropperRef}
//               viewMode={1}
//               scalable={false}
//               crop={handleCrop}
//             />
//           </div>
//         )}
//       </div>

//       <h2>UserName: {profileData.username}</h2>

//       <div className="profile-details">
//         <p>Email: {profileData.email}</p>
//         <p>Phone: {profileData.phone_number}</p>
//         <p>First Name: {profileData.first_name}</p>
//         <p>Last Name: {profileData.last_name}</p>
//         <p>Date Joined: {new Date(profileData.date_joined).toLocaleDateString()}</p>
//       </div>

//       {/* File Input and Submit */}
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="profile_picture">Change Profile Picture:</label>
//         <input
//           type="file"
//           id="profile_picture"
//           name="profile_picture"
//           accept="image/*"
//           onChange={handleFileChange}
//           disabled={uploading}
//         />
//         <button type="submit" disabled={uploading}>
//           {uploading ? "Uploading..." : "Update Picture"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ProfileCard;
import React, { useState, useRef, useCallback, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "../styles/ProfileCard.css";

const ProfileCard = ({ profileData, onProfileUpdate, uploading }) => {
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(profileData.profile_picture || '/images/default-profile.jpg');
  const [croppedImage, setCroppedImage] = useState(null);  // To hold cropped image data URL
  const cropperRef = useRef(null);

  // Sync the profile picture if profileData changes
  useEffect(() => {
    setImageSrc(profileData.profile_picture || '/images/default-profile.jpg');
    setCroppedImage(null); // Reset cropped image when profileData changes
  }, [profileData]);

  // Handle file selection
  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result); // Show the selected image
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  // Handle cropping logic
  const handleCrop = useCallback(() => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
        width: 200,  // You can adjust this to desired crop size
        height: 200, // You can adjust this to desired crop size
      });
      setCroppedImage(croppedCanvas.toDataURL());  // Save the cropped image as data URL
    }
  }, []);

  // Submit the cropped image to the parent component
  const handleSubmit = (e) => {
    e.preventDefault();

    if (file) {
      onProfileUpdate(file);  // Submit the original file if no crop
    } else if (croppedImage) {
      // If there's a cropped image, convert it to a Blob and upload
      const blob = dataURLToBlob(croppedImage);
      onProfileUpdate(blob);  // Submit the cropped image
    }

    // Reset the states after submit
    setFile(null);
    setImageSrc(profileData.profile_picture || '/images/default-profile.jpg'); // Reset to default or previous image
    setCroppedImage(null); // Clear the cropped image
  };

  // Utility function to convert data URL to Blob
  const dataURLToBlob = (dataURL) => {
    const byteString = atob(dataURL.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([uintArray], { type: 'image/png' });
  };

  // Dynamically select whether to show the cropped or original image
  const imageUrl = croppedImage || imageSrc;

  return (
    <div className="profile-card">
      <div
        className="profile-picture-container"
        style={{
          position: "relative", 
          display: "inline-block", 
          width: 200, 
          height: 200,
        }}
      >
        {/* Circular profile picture */}
        <img
          src={`http://127.0.0.1:8000${imageUrl}`}  // Correct image URL path
          alt={`${profileData.username}'s profile`}
          className="profile-picture"
          style={{
            borderRadius: "50%",  // Make the profile picture circular
            width: "100%",        // Ensure the image takes full width
            height: "100%",       // Ensure the image takes full height
            objectFit: "cover",   // Ensure the image covers the circle area
          }}
        />

        {/* Cropper Section (appears only when a file is selected) */}
        {file && (
          <div
            className="cropper-container"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "50%", // Make the cropper circular
              overflow: "hidden",  // Clip the cropper to the circular shape
            }}
          >
            <Cropper
              src={imageSrc}
              style={{ width: "100%", height: "100%" }}
              initialAspectRatio={1}
              aspectRatio={1}
              guides={false}
              ref={cropperRef}
              viewMode={1}
              scalable={false}
              crop={handleCrop}
            />
          </div>
        )}
      </div>

      <h2>UserName: {profileData.username}</h2>

      <div className="profile-details">
        <p>Email: {profileData.email}</p>
        <p>Phone: {profileData.phone_number}</p>
        <p>First Name: {profileData.first_name}</p>
        <p>Last Name: {profileData.last_name}</p>
        <p>Date Joined: {new Date(profileData.date_joined).toLocaleDateString()}</p>
      </div>

      {/* File Input and Submit */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="profile_picture">Change Profile Picture:</label>
        <input
          type="file"
          id="profile_picture"
          name="profile_picture"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Update Picture"}
        </button>
      </form>
    </div>
  );
};

export default ProfileCard;

