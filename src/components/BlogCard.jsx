import React from 'react';
import MediaViewer from './MediaViewer';

/**
 * Formats ISO date string into reader-friendly presentation
 */
function formatDate(isoString) {
  if (!isoString) return 'Recent';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return isoString;
  }
}

/**
 * BlogCard Component
 * Displays post preview with conditional media rendering, metadata,
 * real-time wordCount badge, and CRUD action triggers.
 */
export function BlogCard({ blog, onView, onEdit, onDelete }) {
  // Truncate content for clean preview
  const truncatedContent =
    blog.content.length > 160
      ? `${blog.content.substring(0, 160).trim()}...`
      : blog.content;

  return (
    <article className="blog-card" data-id={blog.id}>
      {/* Media Header (Conditional image/video preview) */}
      <div className="blog-card-media" onClick={() => onView(blog)} role="button" tabIndex={0}>
        <MediaViewer
          imageUrl={blog.imageUrl}
          videoUrl={blog.videoUrl}
          title={blog.title}
          isCard={true}
        />
        {blog.videoUrl && (
          <span className="media-badge video-badge" title="Includes Video">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Video
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span className="meta-date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {formatDate(blog.createdAt)}
          </span>

          <span className="meta-word-count" title="Post length">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            {blog.wordCount || 0} words
          </span>
        </div>

        <h3 className="blog-card-title" onClick={() => onView(blog)} title={blog.title}>
          {blog.title}
        </h3>

        <p className="blog-card-excerpt">
          {truncatedContent}
        </p>
      </div>

      {/* Card Actions Footer */}
      <div className="blog-card-actions">
        <button
          type="button"
          className="card-action-btn btn-view"
          onClick={() => onView(blog)}
          title="Read full post"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Read
        </button>

        <button
          type="button"
          className="card-action-btn btn-edit"
          onClick={() => onEdit(blog)}
          title="Edit post"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>

        <button
          type="button"
          className="card-action-btn btn-delete"
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
              onDelete(blog.id);
            }
          }}
          title="Delete post"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Delete
        </button>
      </div>
    </article>
  );
}

export default BlogCard;
