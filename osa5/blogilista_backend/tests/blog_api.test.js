const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../index");
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const api = supertest(app);

describe("/api/blogs tests with MongoDB", () => {
  let token; // Token tallennetaan tähän

  beforeAll(async () => {
    await User.deleteMany({});
    const newUser = {
      username: "testuser",
      name: "Test User",
      password: "password123",
    };

    console.log("Creating new user...");
    const userCreationResponse = await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    console.log("User creation response:", userCreationResponse.body);

    const loginResponse = await api
      .post("/api/login")
      .send({ username: "testuser", password: "password123" })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    console.log("Login response:", loginResponse.body); // Lisää tämä tarkistamaan, onko token mukana

    token = loginResponse.body.token;

    if (!token) {
      throw new Error("Token missing from login response!");
    }

    console.log("Token obtained:", token);
  });

  test("you can add a blog with a valid token", async () => {
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
      .set("Authorization", `Bearer ${token}`) // Lähetetään token headerissa
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    console.log("Response:", response.body); // Log the response body

    expect(response.body.title).toBe(newBlog.title);
    expect(response.body.author).toBe(newBlog.author);
    expect(response.body.url).toBe(newBlog.url);
    expect(response.body.likes).toBe(newBlog.likes);

    const blogsInDb = await Blog.find({});
    expect(blogsInDb).toHaveLength(initialLength + 1);

    const titles = blogsInDb.map((blog) => blog.title);
    expect(titles).toContain(newBlog.title);
  });

  test("responds with 401 if token is missing when adding a blog", async () => {
    const newBlog = {
      title: "Test blog without token",
      author: "Test author",
      url: "http://www.testblog.com",
      likes: 0,
    };

    const blogsAtStart = await Blog.find({});
    const initialLength = blogsAtStart.length;

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401) // Odotetaan 401 Unauthorized
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toBe("token missing or invalid");

    const blogsInDb = await Blog.find({});
    expect(blogsInDb).toHaveLength(initialLength); // Blogi ei lisätä
  });

  test("api returns blogs", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toBeInstanceOf(Array);
  });

  test("returns all blogs as JSON", async () => {
    const blogsInDb = await Blog.find({});
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(blogsInDb.length);
  });

  test("each blog has id field", async () => {
    const response = await api.get("/api/blogs").expect(200);

    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined(); // Check for 'id' field instead of '_id'
    });
  });

  test("likes field defaults to 0 if not provided", async () => {
    const newBlog = {
      title: "Test blog without likes",
      author: "Test author",
      url: "http://www.testblog.com",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`) // Lähetetään token headerissa
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
      .set("Authorization", `Bearer ${token}`) // Lähetetään token headerissa
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
      .set("Authorization", `Bearer ${token}`) // Lähetetään token headerissa
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
      .set("Authorization", `Bearer ${token}`) // Lähetetään token headerissa
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogId = addedBlog.body.id;

    await api
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`) // Lähetetään token headerissa
      .expect(204);

    const blogsInDb = await Blog.find({});
    const ids = blogsInDb.map((blog) => blog.id);
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
      .set("Authorization", `Bearer ${token}`) // Lähetetään token headerissa
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogId = addedBlog.body.id;

    const updatedLikes = { likes: 10 };

    const response = await api
      .put(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`) // Lähetetään token headerissa
      .send(updatedLikes)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.likes).toBe(updatedLikes.likes);
  });

  test("responds with 404 if blog to update does not exist", async () => {
    const nonExistentId = "645df037de10c4f3c4000000";
    const updatedLikes = { likes: 10 };

    await api
      .put(`/api/blogs/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`) // Lähetetään token headerissa
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
      .set("Authorization", `Bearer ${token}`) // Lähetetään token headerissa
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogId = addedBlog.body.id;

    const invalidLikes = { likes: "invalid_value" };

    const response = await api
      .put(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`) // Lähetetään token headerissa
      .send(invalidLikes)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toBe("Likes must be a number");
  });

  test("returns blogs with user details", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  
    response.body.forEach((blog) => {
      expect(blog.user).toBeDefined();
      expect(blog.user.username).toBeDefined();
      expect(blog.user.name).toBeDefined();
    });
  });
});

describe("/api/users tests with MongoDB", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("password123", 10);
    const initialUser = new User({
      username: "testuser",
      name: "Test User",
      passwordHash,
    });
    await initialUser.save();
  });

  test("creates a valid user", async () => {
    const newUser = {
      username: "newuser",
      name: "New User",
      password: "newpassword123",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.username).toBe(newUser.username);
    expect(response.body.name).toBe(newUser.name);
  });

  test("returns error if username is too short", async () => {
    const newUser = {
      username: "nu",
      name: "New User",
      password: "newpassword123",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toBe(
      "Username must be at least 3 characters long"
    );
  });

  test("returns error if password is too short", async () => {
    const newUser = {
      username: "validuser",
      name: "Valid User",
      password: "12",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toBe(
      "Password must be at least 3 characters long"
    );
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});