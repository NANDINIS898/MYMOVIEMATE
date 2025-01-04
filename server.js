const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'Nandini9958G.7', 
  database: 'movie_app',
});

// Signup API
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).send('All fields (username, email, password) are required.');
  }

  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(query, [username, email, password], (err, result) => {
    if (err) {
      return res.status(500).send('Error registering user: ' + err.message);
    }
    res.status(200).send('User registered successfully');
  });
});

// Login API
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Basic validation
  if (!email || !password) {
    return res.status(400).send('Email and password are required.');
  }
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).send('Error logging in: ' + err.message);
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = results[0];

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).send('Invalid credentials');
    }
       // If credentials are correct, send a success response
       res.status(200).send('Login successful');
    });
  });
    


const TMDB_API_KEY = '482956122a3f6909e6d22e014cefece3' ;
const BASE_URL = 'https://api.themoviedb.org/3';


// Route to get movie recommendations WITH GENRES
app.get('/api/movies/:genreId', async (req, res) => {
  const { genreId } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`); 
    
    res.json(response.data.results);
    console.log(response.data.results);
  } catch (error) {
    res.status(500).send('Error fetching data from TMDB');
  }
});

//GET GENRES
app.get("/api/genres", async (req, res) => {
  try {
      const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`
      );
      res.json(response.data.genres);
  } catch (error) {
      res.status(500).send("Error fetching genres.");
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
