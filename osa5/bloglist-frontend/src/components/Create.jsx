import React, { useState } from 'react';

const Create = ({ onBlogAdded }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreate = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('http://localhost:3003/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, author, url }),
      });

      if (!response.ok) {
        throw new Error('Failed to create blog');
      }

      const newBlog = await response.json();
      console.log('Blog created:', newBlog);
      onBlogAdded(newBlog); // Call the onBlogAdded prop with the new blog
      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (error) {
      console.error('Error creating blog:', error);
      setNotification({ message: 'Failed to create blog', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    }
  };

  return (
    <form onSubmit={handleCreate}>
      <div>
        Title
        <input
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        Author
        <input
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        URL
        <input
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  );
};

export default Create;