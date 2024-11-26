const bcrypt = require("bcryptjs"); // Huom: bcryptjs
const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!password || password.length < 3) {
    return res.status(400).json({ error: 'Password must be at least 3 characters long' });
  }

  if (!username || username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
    blogs: [] // Initialize blogs field as an empty array
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

userRouter.get("/", async (__, response) => {
  try {
    const users = await User.find({});
    response.json(users);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

module.exports = userRouter;