const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../index");
const Blog = require("../models/blog");

const api = supertest(app);

describe("/api/blogs GET tests with MongoDB", () => {
  test("api returns blogs", async () => {
    const response = await api.get("/api/blogs");
    response.body.forEach((blog) => {
      console.log(
        `Blog ID: ${blog.id}, Title: ${blog.title}, Author: ${blog.author}`
      ); // Log blog details
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
      ); // Log blog details
    });
    expect(response.body).toHaveLength(blogsInDb.length);
  });

  test("each blog has id field", async () => {
    const response = await api.get("/api/blogs").expect(200);

    response.body.forEach((blog) => {
      blog.id = blog._id.toString(); // Convert MongoDB's _id field to id
      console.log(
        `Blog ID: ${blog.id}, Title: ${blog.title}, Author: ${blog.author}`
      ); // Log blog details
      expect(blog.id).toBeDefined();
    });
  });

  test("you can add a blog", async () => {
    const newBlog = {
      title: "Test blog",
      author: "Test author",
      url: "http://www.testblog.com",
      likes: 0,
    };

    // Talletetaan alkuperäisten blogien määrä ennen POST-pyyntöä
    const blogsAtStart = await Blog.find({});
    const initialLength = blogsAtStart.length;

    // Lähetetään POST-pyyntö lisättävästä blogista
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201) // Odotetaan, että saamme HTTP 201 vastauksen (luonti)
      .expect("Content-Type", /application\/json/); // Varmistetaan, että vastaus on JSON-muodossa

    // Tarkistetaan, että blogin tiedot ovat oikein
    expect(response.body.title).toBe(newBlog.title);
    expect(response.body.author).toBe(newBlog.author);
    expect(response.body.url).toBe(newBlog.url);
    expect(response.body.likes).toBe(newBlog.likes);

    // Haetaan blogit tietokannasta ja tarkistetaan, että uusi blogi on lisätty
    const blogsInDb = await Blog.find({});
    expect(blogsInDb).toHaveLength(initialLength + 1); // Varmistetaan, että blogien määrä on kasvanut yhdellä

    // Tarkistetaan, että lisätty blogi löytyy tietokannasta
    const titles = blogsInDb.map((blog) => blog.title);
    expect(titles).toContain(newBlog.title); // Varmistetaan, että lisätty blogi löytyy tietokannasta
  });

  test("likes field defaults to 0 if not provided", async () => {
    const newBlog = {
      title: "Test blog without likes",
      author: "Test author",
      url: "http://www.testblog.com",
    };
  
    // Lähetetään POST-pyyntö ilman likes kenttää
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  
    // Varmistetaan, että likes kenttä on 0, vaikka sitä ei annettu
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
      .expect(400) // Varmistetaan, että statuskoodi on 400
      .expect("Content-Type", /application\/json/);
  
    // Varmistetaan, että virheilmoitus sisältää odotetut tiedot
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
      .expect(400) // Varmistetaan, että statuskoodi on 400
      .expect("Content-Type", /application\/json/);
  
    // Varmistetaan, että virheilmoitus sisältää odotetut tiedot
    expect(response.body.error).toBe("url is required");
  });

});

afterAll(async () => {
  await mongoose.connection.close();
});
