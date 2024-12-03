import { useState } from 'react';
import PropTypes from 'prop-types'; // Tuodaan PropTypes
import blogService from '../services/blogs';

const Create = ({ onBlogAdded }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      const newBlog = await blogService.create({ title, author, url });
      console.log('Blog created:', newBlog);
      onBlogAdded(newBlog);
      setTitle('');
      setAuthor('');
      setUrl('');
      setNotification({ message: 'Blog created successfully!', type: 'success' });
      setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    } catch (error) {
      console.error('Error creating blog:', error);
      setNotification({ message: 'Failed to create blog', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    }
  };

  return (
    <div>
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <form onSubmit={handleCreate}>
        <div>
          Title
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="Enter blog title"
          />
        </div>
        <div>
          Author
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="Enter blog author"
          />
        </div>
        <div>
          URL
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder="Enter blog URL"
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

// Määritellään PropTypet Create-komponentille
Create.propTypes = {
  onBlogAdded: PropTypes.func.isRequired,
};

export default Create;
