const express = require("express");
const Blog = require("../models/blog");
const { userExtractor } = require("../utils/auth"); // Import the userExtractor middleware

const blogRouter = express.Router();

// GET /api/blogs
blogRouter.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });

    console.log("Fetched blogs:", blogs);
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/blogs
blogRouter.post("/", userExtractor, async (req, res) => {
  const body = req.body;

  if (!body.title) {
    return res.status(400).json({ error: "title is required" });
  }

  if (!body.url) {
    return res.status(400).json({ error: "url is required" });
  }

  const user = req.user;
  console.log("User ID from token:", user._id); // Log the user ID from the token

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

// GET /api/blogs/:id

blogRouter.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("user", {
      username: 1,
      name: 1,
    });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /api/blogs/:id
blogRouter.delete("/:id", userExtractor, async (req, res) => {
  try {
    console.log("Request received for deleting blog with ID:", req.params.id);
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      console.log("Blog not found");
      return res.status(404).json({ error: "Blog not found" });
    }

    // Varmistetaan, että käyttäjä, joka yrittää poistaa blogin, on sama kuin blogin lisääjä
    if (blog.user.toString() !== req.user.id.toString()) {
      console.log("Unauthorized attempt to delete");
      return res.status(401).json({ error: "unauthorized" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting blog:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//PUT /api/blogs/:id
blogRouter.put("/:id", userExtractor, async (req, res) => {
  const { likes } = req.body;

  if (typeof likes !== "number") {
    return res.status(400).json({ error: "Likes must be a number" });
  }

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }

  blog.likes = likes;
  const updatedBlog = await blog.save();

  res.status(200).json(updatedBlog);
});

module.exports = blogRouter;
