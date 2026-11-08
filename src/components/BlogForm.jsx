import React, { useState, useEffect } from 'react';
import useWordCount from '../hooks/useWordCount';

/**
 * BlogForm Component
 * Shared Form reused for both creating and editing blogs.
 * Enforces strict 1,000-word ceiling with live tokenized calculation,
 * dynamic warning states, and submission blocking.
 */
export function BlogForm({ initialData = null, onSubmit, onCancel, isSubmitting = false }) {
  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    videoUrl: '',
    content: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Sync state when editing blog changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        imageUrl: initialData.imageUrl || '',
        videoUrl: initialData.videoUrl || '',
        content: initialData.content || ''
      });
    } else {
      setFormData({
        title: '',
        imageUrl: '',
        videoUrl: '',
        content: ''
      });
    }
    setFormErrors({});
  }, [initialData]);

  // Hook-based word count evaluator
  const {
    wordCount,
    isOverLimit,
    excessWords,
    percentage,
    remainingWords
  } = useWordCount(formData.content, 1000);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required.';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long.';
    }

    if (!formData.content.trim()) {
      errors.content = 'Post content cannot be empty.';
    } else if (isOverLimit) {
      errors.content = `Content exceeds the 1,000-word limit by ${excessWords} word${excessWords === 1 ? '' : 's'}.`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      wordCount: wordCount
    });
  };

  return (
    <form className="blog-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <h2 className="form-title">
          {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        <p className="form-subtitle">
          {isEditing
            ? 'Update the fields below. Word limit validation applies on keystroke.'
            : 'Compose your article with rich media embed support and real-time word counting.'}
        </p>
      </div>

      {/* Title Field */}
      <div className={`form-group ${formErrors.title ? 'has-error' : ''}`}>
        <label htmlFor="post-title" className="form-label">
          Post Title <span className="required-star">*</span>
        </label>
        <input
          id="post-title"
          type="text"
          className="form-input"
          placeholder="e.g., Mastering React Hooks and Scalable Architecture"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          required
        />
        {formErrors.title && <span className="error-hint">{formErrors.title}</span>}
      </div>

      {/* Media Fields Grid */}
      <div className="form-row-grid">
        {/* Image URL */}
        <div className="form-group">
          <label htmlFor="post-image" className="form-label">
            Image URL <span className="optional-label">(Optional)</span>
          </label>
          <input
            id="post-image"
            type="url"
            className="form-input"
            placeholder="https://picsum.photos/seed/tech/800/400"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange('imageUrl', e.target.value)}
          />
        </div>

        {/* Video URL */}
        <div className="form-group">
          <label htmlFor="post-video" className="form-label">
            Video URL <span className="optional-label">(YouTube/MP4)</span>
          </label>
          <input
            id="post-video"
            type="url"
            className="form-input"
            placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
            value={formData.videoUrl}
            onChange={(e) => handleInputChange('videoUrl', e.target.value)}
          />
        </div>
      </div>

      {/* Content Textarea with 1000-word constraint */}
      <div className={`form-group ${formErrors.content || isOverLimit ? 'has-error' : ''}`}>
        <div className="label-with-counter">
          <label htmlFor="post-content" className="form-label">
            Post Content <span className="required-star">*</span>
          </label>

          {/* Real-time word counter badge */}
          <div className={`word-counter-badge ${isOverLimit ? 'badge-danger' : wordCount > 900 ? 'badge-warning' : 'badge-normal'}`}>
            <span>{wordCount} / 1,000 words</span>
          </div>
        </div>

        <textarea
          id="post-content"
          className={`form-textarea ${isOverLimit ? 'textarea-limit-exceeded' : ''}`}
          rows="8"
          placeholder="Write your blog post body here... Real-time tokenizer tracks words as you type."
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
        />

        {/* Word limit progress bar */}
        <div className="word-progress-track">
          <div
            className={`word-progress-bar ${isOverLimit ? 'progress-danger' : wordCount > 900 ? 'progress-warning' : 'progress-primary'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Informative warning text when exceeding 1,000 words */}
        {isOverLimit && (
          <div className="limit-warning-banner" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>
              <strong>Limit Exceeded:</strong> Content exceeds 1,000 words by <strong>{excessWords}</strong> {excessWords === 1 ? 'word' : 'words'}. Please trim your post to enable submission.
            </span>
          </div>
        )}

        {formErrors.content && !isOverLimit && (
          <span className="error-hint">{formErrors.content}</span>
        )}
      </div>

      {/* Form Action Buttons */}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isOverLimit || isSubmitting || !formData.title.trim() || !formData.content.trim()}
          title={isOverLimit ? 'Reduce words below 1,000 to submit' : undefined}
        >
          {isSubmitting ? (
            <>
              <span className="mini-spinner" />
              Saving...
            </>
          ) : isEditing ? (
            'Update Post'
          ) : (
            'Publish Post'
          )}
        </button>
      </div>
    </form>
  );
}

export default BlogForm;
