import React, { useState } from 'react';

/**
 * Normalizes video URLs to embeddable formats (especially YouTube)
 */
function getEmbedUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();

  // YouTube watch format
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      url: `https://www.youtube.com/embed/${ytMatch[1]}`
    };
  }

  // Direct MP4 or video file
  if (/\.(mp4|webm|ogg)$/i.test(trimmed)) {
    return {
      type: 'html5_video',
      url: trimmed
    };
  }

  // Already embed or generic iframe
  if (trimmed.includes('embed')) {
    return {
      type: 'youtube',
      url: trimmed
    };
  }

  return {
    type: 'generic_video',
    url: trimmed
  };
}

/**
 * MediaViewer Component
 * Conditionally renders images or embedded video players within responsive aspect-ratio frames.
 */
export function MediaViewer({ imageUrl, videoUrl, title = 'Blog Media', isCard = false }) {
  const [imageError, setImageError] = useState(false);
  const videoData = videoUrl ? getEmbedUrl(videoUrl) : null;

  // If video is present, render video player
  if (videoData) {
    if (videoData.type === 'html5_video') {
      return (
        <div className={`media-frame ${isCard ? 'media-frame-card' : ''}`}>
          <video
            src={videoData.url}
            controls
            preload="metadata"
            className="media-content media-video"
            poster={!imageError ? imageUrl : undefined}
          >
            Your browser does not support HTML5 video.
          </video>
        </div>
      );
    }

    return (
      <div className={`media-frame ${isCard ? 'media-frame-card' : ''}`}>
        <iframe
          src={videoData.url}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="media-content media-iframe"
        />
      </div>
    );
  }

  // If image is present and not errored
  if (imageUrl && !imageError) {
    return (
      <div className={`media-frame ${isCard ? 'media-frame-card' : ''}`}>
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          onError={() => setImageError(true)}
          className="media-content media-image"
        />
      </div>
    );
  }

  // Fallback when no media or image fails
  return (
    <div className={`media-frame media-placeholder ${isCard ? 'media-frame-card' : ''}`}>
      <div className="placeholder-content">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span>No media preview</span>
      </div>
    </div>
  );
}

export default MediaViewer;
