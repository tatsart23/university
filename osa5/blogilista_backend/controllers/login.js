const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const loginRouter = express.Router();

// Kirjautumisreitti
loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Tarkistetaan, että käyttäjänimi ja salasana on annettu
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Haetaan käyttäjä tietokannasta käyttäjätunnuksen perusteella
    const user = await User.findOne({ username });

    // Tarkistetaan, että käyttäjä löytyy
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Tarkistetaan, että salasana on oikea
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Luodaan JWT-token käyttäjälle
    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: '1h', // Token on voimassa 1 tunnin ajan
    });

    // Palautetaan token vastauksena
    res.status(200).json({ token, username: user.username, name: user.name });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Something went wrong during login' });
  }
});

module.exports = loginRouter;
