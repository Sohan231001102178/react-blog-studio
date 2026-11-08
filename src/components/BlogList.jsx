import React from 'react';
import BlogCard from './BlogCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorNotice from './ErrorNotice';

/**
 * BlogList Component
 * Displays the responsive grid of blog cards with three distinct presentation states:
 * 1. LoadingSpinner during REST API retrieval
 * 2. ErrorNotice with retry trigger on network failure
 * 3. Empty state prompt when no posts match search or database is empty
 */
export function BlogList({
  blogs,
  loading,
  error,
  onRetry,
  onView,
  onEdit,
  onDelete,
  onAddNew,
  searchQuery
}) {
  // 1. Loading State
  if (loading) {
    return <LoadingSpinner message="Fetching blog entries from REST API..." />;
  }

  // 2. Error State
  if (error) {
    return <ErrorNotice error={error} onRetry={onRetry} />;
  }

  // 3. Empty State (either database empty or search query has no hits)
  if (!blogs || blogs.length === 0) {
    return (
      <div className="state-container empty-state">
        <div className="empty-state-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="13" y2="17" />
          </svg>
        </div>
        <h3 className="empty-state-title">
          {searchQuery ? 'No Matching Blog Posts' : 'No Blog Posts Found'}
        </h3>
        <p className="empty-state-desc">
          {searchQuery
            ? `We couldn't find any articles containing "${searchQuery}". Try a different keyword.`
            : 'Your blog database is currently empty. Create your very first post to get started!'}
        </p>
        <button
          type="button"
          className="btn btn-primary btn-empty-cta"
          onClick={onAddNew}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create New Post
        </button>
      </div>
    );
  }

  // Active Grid of Blogs
  return (
    <div className="blog-grid" role="feed" aria-label="Blog posts list">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default BlogList;
