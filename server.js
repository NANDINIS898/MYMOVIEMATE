const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;
app.use(cors());


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
