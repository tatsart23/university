const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String
  },
  author: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,  // Oletusarvo 0, jos arvoa ei anneta
  },
});
  
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog