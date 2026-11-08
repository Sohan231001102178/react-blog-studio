import React from 'react';

/**
 * ErrorNotice Component
 * Presents network/API failure states with diagnostic guidance and a retry action button.
 */
export function ErrorNotice({ error, onRetry }) {
  return (
    <div className="state-container error-state" role="alert">
      <div className="error-icon-box">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <div className="error-content">
        <h3 className="error-title">Unable to Connect to REST API</h3>
        <p className="error-description">
          {error || 'An unexpected error occurred while communicating with json-server.'}
        </p>
        <div className="error-tip">
          <code>Tip: Run `json-server --watch db.json --port 5000` to boot the backend.</code>
        </div>
      </div>

      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-retry">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Retry Connection
        </button>
      )}
    </div>
  );
}

export default ErrorNotice;
