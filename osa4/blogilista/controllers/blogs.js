const express = require("express");
const blogRouter = express.Router();
const Blog = require("../models/blog");

// GET /api/blogs
blogRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

// POST /api/blogs
blogRouter.post("/", (request, response) => {
  const body = request.body;

  if (!body.title) {
    return response.status(400).json({ error: "title is required" });
  }

  if (!body.url) {
    return response.status(400).json({ error: "url is required" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author || "",
    url: body.url,
    likes: body.likes || 0,
  });

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => {
      response.status(500).json({ error: "something went wrong" });
    });
});

module.exports = blogRouter;
