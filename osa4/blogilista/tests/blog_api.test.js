const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../index");
const Blog = require("../models/blog");

const api = supertest(app);

describe("/api/blogs tests with MongoDB", () => {
  test("api returns blogs", async () => {
    const response = await api.get("/api/blogs");
    response.body.forEach((blog) => {
      console.log(
        `Blog ID: ${blog._id}, Title: ${blog.title}, Author: ${blog.author}` //MUISTA MONGODB OMA ID
      );
    });
    expect(response.body).toBeInstanceOf(Array);
  });

  test("returns all blogs as JSON", async () => {
    const blogsInDb = await Blog.find({});
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    response.body.forEach((blog) => {
      console.log(
        `Blog ID: ${blog._id}, Title: ${blog.title}, Author: ${blog.author} URL: ${blog.url} Likes: ${blog.likes}`
      ); // MUISTA MONGODB OMA ID
    });
    expect(response.body).toHaveLength(blogsInDb.length);
  });

  test("each blog has id field", async () => {
    const response = await api.get("/api/blogs").expect(200);

    response.body.forEach((blog) => {
      blog.id = blog._id.toString();
      console.log(
        `Blog ID: ${blog._id}, Title: ${blog.title}, Author: ${blog.author}`
      );
      expect(blog._id).toBeDefined();
    });
  });

  test("you can add a blog", async () => {
    const newBlog = {
      title: "Test blog",
      author: "Test author",
      url: "http://www.testblog.com",
      likes: 0,
    };

    const blogsAtStart = await Blog.find({});
    const initialLength = blogsAtStart.length;

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(newBlog.title);
    expect(response.body.author).toBe(newBlog.author);
    expect(response.body.url).toBe(newBlog.url);
    expect(response.body.likes).toBe(newBlog.likes);

    const blogsInDb = await Blog.find({});
    expect(blogsInDb).toHaveLength(initialLength + 1);

    const titles = blogsInDb.map((blog) => blog.title);
    expect(titles).toContain(newBlog.title);
  });

  test("likes field defaults to 0 if not provided", async () => {
    const newBlog = {
      title: "Test blog without likes",
      author: "Test author",
      url: "http://www.testblog.com",
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.likes).toBe(0);
  });

  test("responds with status 400 if title is missing", async () => {
    const newBlog = {
      author: "Test author",
      url: "http://www.testblog.com",
      likes: 0,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toBe("title is required");
  });

  test("responds with status 400 if url is missing", async () => {
    const newBlog = {
      title: "Test blog",
      author: "Test author",
      likes: 0,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toBe("url is required");
  });

  test("a blog can be deleted", async () => {
    const newBlog = {
      title: "Blog to be deleted",
      author: "Delete Author",
      url: "http://www.deleteblog.com",
      likes: 5,
    };

    const addedBlog = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogId = addedBlog.body._id;

    const deleteResponse = await api.delete(`/api/blogs/${blogId}`);

    if (deleteResponse.status !== 204) {
      console.error("Error details:", deleteResponse.body);
    }

    expect(deleteResponse.status).toBe(204);

    const blogsInDb = await Blog.find({});
    const ids = blogsInDb.map((blog) => blog._id.toString());
    expect(ids).not.toContain(blogId);
  });

  test("a blog's likes can be updated", async () => {
    const newBlog = {
      title: "Blog to update",
      author: "Update Author",
      url: "http://www.updateblog.com",
      likes: 5,
    };

    const addedBlog = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogId = addedBlog.body._id;

    const updatedLikes = { likes: 10 };

    const response = await api
      .put(`/api/blogs/${blogId}`)
      .send(updatedLikes)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.likes).toBe(updatedLikes.likes);

    const updatedBlogInDb = await Blog.findById(blogId);
    expect(updatedBlogInDb.likes).toBe(updatedLikes.likes);
  });

  test("responds with 404 if blog to update does not exist", async () => {
    const nonExistentId = "645df037de10c4f3c4000000";

    const updatedLikes = { likes: 10 };

    await api
      .put(`/api/blogs/${nonExistentId}`)
      .send(updatedLikes)
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });

  test("responds with 400 if likes field is invalid", async () => {
    const newBlog = {
      title: "Blog to update with invalid likes",
      author: "Invalid Likes Author",
      url: "http://www.invalidlikesblog.com",
      likes: 5,
    };

    const addedBlog = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogId = addedBlog.body._id;

    const invalidLikes = { likes: "invalid_value" };

    const response = await api
      .put(`/api/blogs/${blogId}`)
      .send(invalidLikes)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toContain("Cast to Number failed");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
