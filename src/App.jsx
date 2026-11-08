import React, { useState } from 'react';
import useBlogs from './hooks/useBlogs';
import SearchBar from './components/SearchBar';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import BlogDetailModal from './components/BlogDetailModal';

export function App() {
  const {
    blogs,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    loadBlogs,
    addBlog,
    editBlog,
    deleteBlog,
    feedback,
    clearFeedback
  } = useBlogs();

  // Navigation & View Coordination: 'list' | 'add' | 'edit'
  const [activeView, setActiveView] = useState('list');
  const [editingTarget, setEditingTarget] = useState(null);
  const [viewingTarget, setViewingTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // View Handlers
  const handleOpenAdd = () => {
    setEditingTarget(null);
    setActiveView('add');
  };

  const handleOpenEdit = (blog) => {
    setEditingTarget(blog);
    setActiveView('edit');
  };

  const handleCloseForm = () => {
    setActiveView('list');
    setEditingTarget(null);
  };

  const handleOpenDetail = (blog) => {
    setViewingTarget(blog);
  };

  const handleCloseDetail = () => {
    setViewingTarget(null);
  };

  // CRUD actions
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (activeView === 'edit' && editingTarget) {
        await editBlog(editingTarget.id, formData);
      } else {
        await addBlog(formData);
      }
      setActiveView('list');
      setEditingTarget(null);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      if (viewingTarget && String(viewingTarget.id) === String(id)) {
        setViewingTarget(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="app-shell">
      {/* Toast Notification Alert */}
      {feedback && (
        <aside
          className={`toast-notification toast-${feedback.type}`}
          role="status"
          aria-live="polite"
        >
          <div className="toast-icon">
            {feedback.type === 'success' && '✓'}
            {feedback.type === 'error' && '✕'}
            {feedback.type === 'info' && 'ℹ'}
          </div>
          <span className="toast-text">{feedback.message}</span>
          <button
            type="button"
            className="toast-close-btn"
            onClick={clearFeedback}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </aside>
      )}

      {/* Top Application Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="brand-group">
            <div className="brand-logo-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
            </div>
            <div>
              <h1 className="brand-title">Blog Studio</h1>
              <span className="brand-subtitle">REST API CRUD with JSON Server</span>
            </div>
          </div>

          <div className="header-actions">
            <a
              href="presentation.html"
              target="_blank"
              rel="noreferrer"
              className="btn btn-presentation-pill"
              title="Open full interactive presentation & architecture deck"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span>Presentation Deck</span>
            </a>

            {activeView === 'list' && (
              <button
                type="button"
                className="btn btn-primary btn-create"
                onClick={handleOpenAdd}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Write Post
              </button>
            )}

            {activeView !== 'list' && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseForm}
              >
                ← Back to List
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        {/* VIEW 1 & 2: CREATE / EDIT FORM */}
        {activeView === 'add' || activeView === 'edit' ? (
          <section className="form-wrapper-view">
            <BlogForm
              initialData={editingTarget}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseForm}
              isSubmitting={isSubmitting}
            />
          </section>
        ) : (
          /* VIEW 3: BLOGS LIST & SEARCH */
          <section className="list-wrapper-view">
            {/* Search and Filter Strip */}
            <div className="filter-panel">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                totalMatches={blogs.length}
              />
            </div>

            {/* Blogs List */}
            <BlogList
              blogs={blogs}
              loading={loading}
              error={error}
              onRetry={() => loadBlogs(searchQuery)}
              onView={handleOpenDetail}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onAddNew={handleOpenAdd}
              searchQuery={searchQuery}
            />
          </section>
        )}
      </main>

      {/* DETAIL MODAL OVERLAY */}
      {viewingTarget && (
        <BlogDetailModal
          blog={viewingTarget}
          onClose={handleCloseDetail}
          onEdit={(blog) => {
            handleCloseDetail();
            handleOpenEdit(blog);
          }}
          onDelete={handleDelete}
        />
      )}

      {/* Footer Info */}
      <footer className="app-footer">
        <div className="footer-container">
          <p>
            Blog Application (CRUD) • Mock REST API: <code>http://localhost:5000/blogs</code>
          </p>
          <p className="footer-subtext">
            Features: 1,000-Word Constraint • Media Support (YouTube/MP4/Img) • Debounced Search • Centralized Axios Service
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
