const express = require("express");
const blogRouter = express.Router();
const Blog = require("../models/blog");

// GET /api/blogs
blogRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

// DELETE /api/blogs/:id
blogRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Blog.findByIdAndDelete(id);

    if (result) {
      res.status(204).end(); 
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" }); 
  }
});

// PUT /api/blogs/:id
blogRouter.put("/:id", async (req, res) => {
  const { likes } = req.body;

  const update = { likes };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true, context: "query" }
    );

    if (updatedBlog) {
      res.json(updatedBlog);
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    console.error("Error updating blog:", error.message);
    res.status(400).json({ error: error.message });
  }
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
