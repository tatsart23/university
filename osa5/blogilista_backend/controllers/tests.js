const express = require("express");
const User = require('../models/user'); // Malli käyttäjille

const testingRouter = express.Router();

// Resetoi vain testikäyttäjä
testingRouter.post('/reset', async (req, res) => {
  try {
    console.log("Poistetaan vain testikäyttäjä..."); 
    const deletedUser = await User.deleteOne({ name: "Test User" });
    if (deletedUser.deletedCount > 0) {
      console.log("Testikäyttäjä poistettu.");
      res.status(204).end();
    } else {
      console.log("Testikäyttäjää ei löytynyt.");
      res.status(404).json({ error: 'Testikäyttäjää ei löytynyt' });
    }
  } catch (error) {
    console.error("Virhe testikäyttäjän poistamisessa:", error);
    res.status(500).json({ error: 'Testikäyttäjän poistaminen epäonnistui' });
  }
});

// Testireitti
testingRouter.get('/reset', async (req, res) => {
  res.send('Hello World');
});

module.exports = testingRouter;
