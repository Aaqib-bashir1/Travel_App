


import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Import default Swiper styles
import 'swiper/css/navigation'; // Import Navigation styles
import 'swiper/css/pagination'; // Import Pagination styles
import 'swiper/css/autoplay'; // Import Autoplay styles
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // Import Swiper's modules
import '../../styles/ImageGallery.css'; // Your custom styles

const ImageGallery = ({ media = [], galleryWidth = '400px', galleryHeight = 'auto' }) => {
  if (!media.length) {
    return <p>No images or videos available</p>;
  }

  return (
    <div className="image-gallery-container" style={{ width: galleryWidth, height: galleryHeight }}>
      <Swiper
        spaceBetween={10} // Space between slides
        slidesPerView={1} // Only show 1 slide at a time
        loop={true} // Enable looping
        navigation={false} // Enable next/prev navigation buttons
        pagination={{ clickable: true }} // Enable clickable pagination dots
        autoplay={{ delay: 3000, disableOnInteraction: false }} // Auto-slide every 3 seconds
        modules={[Navigation, Pagination, Autoplay]} // Add Navigation, Pagination, and Autoplay modules
      >
        {media.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="swiper-slide-content">
              <div className="media-container">
                {item.media_type === 'image' ? (
                  <img
                    src={item.file} // Assuming 'file' contains the media file path
                    alt={`Media ${index + 1}`}
                    className="swiper-image" // Apply swiper-image class for uniform size
                  />
                ) : (
                  <video
                    src={item.file} // Assuming 'file' contains the media file path
                    controls
                    className="swiper-video"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              {item.caption && <p className="swiper-caption">{item.caption}</p>}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageGallery;
