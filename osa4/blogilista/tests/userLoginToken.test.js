const supertest = require('supertest');
const app = require('../index'); // Polku omaan sovellukseen
const api = supertest(app);
const mongoose = require('mongoose');

describe('Login and token generation', () => {
  let token;

  beforeAll(async () => {
    // Luodaan käyttäjä
    const newUser = {
      username: "testuser",
      name: "Test User",
      password: "password123", // Salasana
    };

    await api
      .post('/api/users')  // Käytetään suojaamatonta reittiä käyttäjän luomiseen
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // Kirjaudu sisään ja saa token
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'password123' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    token = loginResponse.body.token;
    console.log('Token:', token); // Loggaa token

    // Varmista, että token on saatu
    expect(token).toBeDefined();
  });

  test('Access protected route with token', async () => {
    // Testi suojatun reitin testaamiseksi käyttäen tokenia
    const response = await api
      .post('/api/users')  // Suojattu reitti
      .set('Authorization', `Bearer ${token}`)  // Lisää token pyyntöön
      .send({ username: 'newuser', name: 'New User', password: 'password123' })  // Lähetä uusi käyttäjä
      .expect(201); // Odotetaan 201 OK -vastausta

    // Varmista, että uusi käyttäjä luotiin ja että vastauksessa on odotetut tiedot
    expect(response.body.username).toBe('newuser');
    expect(response.body.name).toBe('New User');
  });

  afterAll(async () => {
    // Sulje MongoDB-yhteys testien jälkeen
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  });
});
