import React from 'react';
import MediaViewer from './MediaViewer';

/**
 * BlogDetailModal Component
 * Full-screen reading overlay presenting the blog's complete content,
 * full embedded media viewer, metadata tags, and quick-action buttons.
 */
export function BlogDetailModal({ blog, onClose, onEdit, onDelete }) {
  if (!blog) return null;

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Recent';

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content modal-detail" onClick={(e) => e.stopPropagation()}>
        {/* Modal Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close post viewer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Media Banner */}
        {(blog.imageUrl || blog.videoUrl) && (
          <div className="detail-media-container">
            <MediaViewer
              imageUrl={blog.imageUrl}
              videoUrl={blog.videoUrl}
              title={blog.title}
              isCard={false}
            />
          </div>
        )}

        <div className="detail-body">
          {/* Metadata chips */}
          <div className="detail-meta-row">
            <span className="detail-chip date-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formattedDate}
            </span>

            <span className="detail-chip word-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              {blog.wordCount || 0} words
            </span>

            {blog.id && (
              <span className="detail-chip id-chip">
                ID #{blog.id}
              </span>
            )}
          </div>

          <h1 className="detail-title">{blog.title}</h1>

          <div className="detail-article-text">
            {blog.content.split('\n').map((paragraph, idx) => (
              paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
            ))}
          </div>

          {/* Action Footer */}
          <div className="detail-actions-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                onEdit(blog);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Post
            </button>

            <button
              type="button"
              className="btn btn-danger-outline"
              onClick={() => {
                if (window.confirm(`Delete "${blog.title}"?`)) {
                  onDelete(blog.id);
                  onClose();
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Delete Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailModal;
