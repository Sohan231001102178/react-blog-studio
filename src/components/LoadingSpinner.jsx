import React from 'react';

/**
 * LoadingSpinner Component
 * Displays a sleek, modern animated SVG spinner with informative message.
 */
export function LoadingSpinner({ message = 'Loading blog posts...' }) {
  return (
    <div className="state-container loading-state" role="status" aria-live="polite">
      <div className="spinner-wrapper">
        <svg
          className="spinner-svg"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="spinner-track"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle
            className="spinner-head"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="80"
            strokeDashoffset="60"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="state-message">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
