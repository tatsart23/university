const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user'); // Import the User model

const tokenExtractor = (request, ___, next) => {
  const authorization = request.get('Authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.substring(7); // Poimitaan token Bearer-sanan jälkeen
  }
  next(); // Jatketaan ilman virhettä, koska kaikki reitit eivät vaadi tokenia
};

// userExtractor middleware
const userExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    console.log("Token:", token); // Log the token

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.SECRET);
      console.log("Decoded token:", decodedToken); // Log the decoded token
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' });
    }

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    console.log("User ID from token:", decodedToken.id); // Log the user ID from the token

    const user = await User.findById(decodedToken.id);
    console.log("User found:", user); // Log the user

    if (!user) {
      return res.status(401).json({ error: 'user not found' });
    }
    req.user = user;
  } else {
    return res.status(401).json({ error: 'token missing or invalid' });
  }
  next();
};

module.exports = { tokenExtractor, userExtractor };