import { useState } from 'react';
import PropTypes from 'prop-types'; // Tuodaan PropTypes

const Blog = ({ blog, handleLike, handleDelete }) => {
  const [showBlogDetails, setShowBlogDetails] = useState(false);

  const toggleShowBlogDetails = () => {
    setShowBlogDetails(!showBlogDetails);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const buttonStyle = {
    backgroundColor: 'red',
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
        <button onClick={toggleShowBlogDetails}>
          {showBlogDetails ? 'Hide' : 'View'}
        </button>
      </div>
      {showBlogDetails && (
        <div>
          <p>Author: {blog.author}</p>
          <p>User: {blog.user && blog.user.name ? blog.user.name : ''} </p>
          <p>URL: {blog.url}</p>
          <p>
            Likes: {blog.likes}
            <button onClick={() => handleLike(blog)}>Like</button>
          </p>
          <button onClick={() => handleDelete(blog)} style={buttonStyle}>Delete</button>
        </div>
      )}
    </div>
  );
};

// Määritellään PropTypet Blog-komponentille
Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string,
      _id: PropTypes.string.isRequired
    }).isRequired,
  }).isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Blog;
