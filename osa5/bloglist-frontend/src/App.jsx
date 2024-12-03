import { useState, useEffect } from 'react';
import Blog from './components/Blog.jsx';
import blogService from './services/blogs.js';
import Login from './components/Login.jsx';
import Logout from './components/Logout.jsx';
import Create from './components/Create.jsx';
import Notification from './components/Notification.jsx';
import './App.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      blogService.setToken(token);
      blogService.getAll().then(blogs => setBlogs(blogs));
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    blogService.setToken(token);
    blogService.getAll().then(blogs => setBlogs(blogs));
    setNotification({ message: 'Login successful', type: 'success' });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setBlogs([]);
    setNotification({ message: 'Logged out', type: 'success' });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  const handleBlogAdded = (newBlog) => {
    setBlogs(blogs.concat(newBlog));
    setShowCreateForm(false);
    setNotification({ message: `A new blog '${newBlog.title}' by ${newBlog.author} added`, type: 'success' });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
  
    try {
      const updated = await blogService.update(blog.id || blog._id, updatedBlog);
      setBlogs(blogs.map((b) => 
        (b.id || b._id) === (updated.id || updated._id) ? updated : b
      ));
      setNotification({ message: `You liked '${updated.title}'`, type: 'success' });
    } catch (error) {
      console.error('Error updating blog:', error);
      setNotification({ message: 'Failed to like the blog', type: 'error' });
    }
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Delete blog '${blog.title}' by ${blog.author}?`)) {
      try {
        await blogService.deleteBlog(blog.id || blog._id);
        setBlogs(blogs.filter((b) => (b.id || b._id) !== (blog.id || blog._id)));
        setNotification({ message: `Blog '${blog.title}' deleted`, type: 'success' });
      } catch (error) {
        console.error('Error deleting blog:', error);
        setNotification({ message: 'Failed to delete the blog', type: 'error' });
      }
    }
  };
  
  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      {isLoggedIn ? (
        <>
          <h2>Blogs</h2>
          <Logout onLogout={handleLogout} />
          <button onClick={toggleCreateForm}>
            {showCreateForm ? 'Cancel' : 'Create New Blog'}
          </button>
          {showCreateForm && <Create onBlogAdded={handleBlogAdded} />}
          {blogs.sort((a, b) => a.likes < b.likes ? 1 : -1).map(blog => (
            <Blog handleDelete={handleDelete} handleLike={handleLike} key={blog.id} blog={blog} />
          ))}
        </>
      ) : (
        <Login onLogin={handleLogin} setNotification={setNotification} />
      )}
    </div>
  );
};

export default App;
