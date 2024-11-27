import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import Login from './components/Login';
import Logout from './components/Logout';
import Create from './components/Create';
import Notification from './components/Notification';
import './App.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

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
    setNotification({ message: `a new blog ${newBlog.title} by ${newBlog.author} added`, type: 'success' });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      {isLoggedIn ? (
        <>
          <h2>blogs</h2>
          <Logout onLogout={handleLogout} />
          <Create onBlogAdded={handleBlogAdded} />
          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      ) : (
        <Login onLogin={handleLogin} setNotification={setNotification} />
      )}
    </div>
  );
};

export default App;