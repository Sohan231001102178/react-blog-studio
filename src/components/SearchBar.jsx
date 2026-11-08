import React from 'react';

/**
 * SearchBar Component
 * Captures user keystrokes for instant keyword filtering across post titles and bodies.
 * Includes clean reset/clear trigger and keyboard shortcut (Escape to clear).
 */
export function SearchBar({ value, onChange, onClear, totalMatches }) {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <svg
          className="search-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          type="text"
          className="search-input"
          placeholder="Search blogs by title or content keywords..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClear();
          }}
          aria-label="Search blog posts"
        />

        {value && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClear}
            aria-label="Clear search query"
            title="Clear search (Esc)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {value && (
        <div className="search-match-badge">
          <span>{totalMatches} {totalMatches === 1 ? 'match' : 'matches'} found</span>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
