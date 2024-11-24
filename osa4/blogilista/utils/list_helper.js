const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const favorite = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0]);
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const blogCounts = _.countBy(blogs, 'author');
  const authorWithMostBlogs = Object.entries(blogCounts).reduce((max, [author, count]) => {
    return count > max.blogs ? { author, blogs: count } : max;
  }, { author: '', blogs: 0 });

  return authorWithMostBlogs;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const likesByAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  const authorWithMostLikes = Object.entries(likesByAuthor).reduce((max, [author, likes]) => {
    return likes > max.likes ? { author, likes } : max;
  }, { author: '', likes: 0 });

  return authorWithMostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
