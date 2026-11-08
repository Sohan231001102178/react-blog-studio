import { useState, useEffect, useCallback } from 'react';
import blogService from '../api/blogService';

/**
 * Custom Hook: useBlogs
 * Coordinates REST API interactions with state management:
 * - Loading indicator state
 * - Error reporting and retry handler
 * - Debounced / controlled search query filtering
 * - Optimistic or verified CRUD operations
 */
export function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState(null); // toast notification: { type: 'success'|'error'|'info', message: '' }

  const showNotification = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  /**
   * Fetch blogs from REST API endpoint
   */
  const loadBlogs = useCallback(async (query = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getAll(query);
      setBlogs(data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err.message || 'Failed to communicate with JSON REST API server.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Initial fetch and on search change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadBlogs(searchQuery);
    }, 250); // slight debounce for search keystrokes

    return () => clearTimeout(timer);
  }, [searchQuery, loadBlogs]);

  /**
   * Add a new blog
   */
  const addBlog = async (newBlogData) => {
    setLoading(true);
    try {
      const created = await blogService.create(newBlogData);
      setBlogs(prev => [created, ...prev]);
      showNotification('Blog post published successfully!', 'success');
      return created;
    } catch (err) {
      setError(err.message || 'Error publishing blog post.');
      showNotification('Could not save post. Check API connection.', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Edit/Update an existing blog
   */
  const editBlog = async (id, updatedData) => {
    setLoading(true);
    try {
      const updated = await blogService.update(id, updatedData);
      setBlogs(prev => prev.map(b => (String(b.id) === String(id) ? updated : b)));
      showNotification('Blog post updated successfully!', 'success');
      return updated;
    } catch (err) {
      setError(err.message || 'Error updating blog post.');
      showNotification('Update failed. Please retry.', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a blog
   */
  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(prev => prev.filter(b => String(b.id) !== String(id)));
      showNotification('Blog post deleted successfully.', 'info');
      return true;
    } catch (err) {
      setError(err.message || 'Error deleting blog post.');
      showNotification('Deletion failed.', 'error');
      throw err;
    }
  };

  return {
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
    clearFeedback: () => setFeedback(null)
  };
}

export default useBlogs;
