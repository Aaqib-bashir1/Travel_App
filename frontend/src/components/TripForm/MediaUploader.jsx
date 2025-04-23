
// import React from 'react';

// // --- MediaUploader Component ---
// function MediaUploader({
//   coverImage,
//   media,
//   handleCoverImageChange,
//   handleMediaChange,
//   addMediaField,
//   removeMediaField,
//   handleDeleteMedia,
// }) {
//   return (
//     <div className="media-uploader">
//       <div className="cover-image">
//         <label>Cover Image:</label>
//         <input type="file" name="cover" onChange={handleCoverImageChange} />
//         {coverImage && (
//           <img
//             src={
//               // typeof coverImage === 'string'
//               //   ? `${URL.createObjectURL(coverImage)}`//coverImage
//               //   : `${URL.createObjectURL(coverImage)}`
//               `${import.meta.env.VITE_API_URL}${coverImage}`
//             }

//             alt="Cover Preview"
//             style={{ maxWidth: '200px', display: 'block', marginTop: '10px' }}
//           />
//         )}
//       </div>
//       <div className="media-list">
//         <h4>Additional Media</h4>
//         {media &&
//           media.map((item, index) => (
//             <div key={index} className="media-item" style={{ marginBottom: '20px' }}>
//               {/* Render a preview if file exists */}
//               {item.file ? (
//                 typeof item.file === 'string' ? (
//                   item.media_type === 'image' ? (
//                     <img
//                       src={item.file}
//                       alt={item.caption || 'Media'}
//                       style={{ maxWidth: '200px', display: 'block' }}
//                     />
//                   ) : (
//                     <video controls style={{ maxWidth: '200px', display: 'block' }}>
//                       <source src={item.file} type="video/mp4" />
//                       Your browser does not support the video tag.
//                     </video>
//                   )
//                 ) : (
//                   item.media_type === 'image' ? (
//                     <img
//                       src={URL.createObjectURL(item.file)}
//                       alt={item.caption || 'Media'}
//                       style={{ maxWidth: '200px', display: 'block' }}
//                     />
//                   ) : (
//                     <video controls style={{ maxWidth: '200px', display: 'block' }}>
//                       <source src={URL.createObjectURL(item.file)} type="video/mp4" />
//                       Your browser does not support the video tag.
//                     </video>
//                   )
//                 )
//               ) : null}
//               <div className="media-inputs">
//                 <input
//                   type="text"
//                   name="caption"
//                   placeholder="Caption"
//                   value={item.caption || ''}
//                   onChange={(e) => handleMediaChange(e, index)}
//                   style={{ marginRight: '10px' }}
//                 />
//                 <select
//                   name="media_type"
//                   value={item.media_type || 'image'}
//                   onChange={(e) => handleMediaChange(e, index)}
//                   style={{ marginRight: '10px' }}
//                 >
//                   <option value="image">Image</option>
//                   <option value="video">Video</option>
//                 </select>
//                 <input
//                   type="file"
//                   name="file"
//                   onChange={(e) => handleMediaChange(e, index)}
//                 />
//               </div>
//               <div className="media-buttons" style={{ marginTop: '10px' }}>
//                 {item.id && (
//                   <button type="button" onClick={() => handleDeleteMedia(item.id)}>
//                     Delete from server
//                   </button>
//                 )}
//                 <button type="button" onClick={() => removeMediaField(index)}>
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//         <button type="button" onClick={addMediaField}>
//           Add Media Field
//         </button>
//       </div>
//     </div>
//   );
// }
// export default MediaUploader;

import React from 'react';

function MediaUploader({
  coverImage,
  media,
  handleCoverImageChange,
  handleMediaChange,
  addMediaField,
  removeMediaField,
  handleDeleteMedia,
}) {
  // Remove trailing slashes from the base URL.
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

  // Helper function to get the correct URL for a file.
  const getFileUrl = (file) => {
    if (!file) return '';
    if (typeof file === 'string') {
      // If already an absolute URL, return as is.
      return file.startsWith('http')
        ? file
        : `${baseUrl}/${file.replace(/^\/+/, '')}`;
    }
    // For File objects, create an object URL.
    return URL.createObjectURL(file);
  };

  return (
    <div className="media-uploader">
      <div className="cover-image">
        <label>Cover Image:</label>
        <input type="file" name="cover" onChange={handleCoverImageChange} />
        {coverImage && (
          <img
            src={getFileUrl(coverImage)}
            alt="Cover Preview"
            style={{ maxWidth: '200px', display: 'block', marginTop: '10px' }}
          />
        )}
      </div>
      <div className="media-list">
        <h4>Additional Media</h4>
        {media &&
          media.map((item, index) => (
            <div
              key={index}
              className="media-item"
              style={{ marginBottom: '20px' }}
            >
              {item.file ? (
                item.media_type === 'image' ? (
                  <img
                    src={getFileUrl(item.file)}
                    alt={item.caption || 'Media'}
                    style={{ maxWidth: '200px', display: 'block' }}
                  />
                ) : (
                  <video
                    controls
                    style={{ maxWidth: '200px', display: 'block' }}
                  >
                    <source src={getFileUrl(item.file)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )
              ) : null}
              <div className="media-inputs">
                <input
                  type="text"
                  name="caption"
                  placeholder="Caption"
                  value={item.caption || ''}
                  onChange={(e) => handleMediaChange(e, index)}
                  style={{ marginRight: '10px' }}
                />
                <select
                  name="media_type"
                  value={item.media_type || 'image'}
                  onChange={(e) => handleMediaChange(e, index)}
                  style={{ marginRight: '10px' }}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                <input
                  type="file"
                  name="file"
                  onChange={(e) => handleMediaChange(e, index)}
                />
              </div>
              <div className="media-buttons" style={{ marginTop: '10px' }}>
                {item.id && (
                  <button
                    type="button"
                    onClick={() => handleDeleteMedia(item.id)}
                  >
                    Delete from server
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeMediaField(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        <button type="button" onClick={addMediaField}>
          Add Media Field
        </button>
      </div>
    </div>
  );
}

export default MediaUploader;
