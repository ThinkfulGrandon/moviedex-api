require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIES = require('./movies.json');

const app = express();
app.use(helmet());
const morganSetting = process.env.NOTE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting));
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const bearerToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;
    if(!bearerToken || bearerToken.split(" ")[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized Request'})
    }
    next()
});

function handleGetMovie(req, res) {
    const { genre, country, avg_vote } = req.query;
    let movieList;
    if(!genre && !country && !avg_vote) {
        movieList = MOVIES
    }
    if(genre) {
        movieList = MOVIES.filter(movie =>
             movie.genre.toLowerCase().includes(genre.toLowerCase()))
    }
    if(country) {
        movieList = MOVIES.filter(movie =>
             movie.country.toLowerCase().includes(country.toLowerCase()))
    }
    if(avg_vote) {
        movieList = MOVIES.filter(movie =>
             movie.avg_vote >= avg_vote)
    }
    if(genre && avg_vote) {
        let list = MOVIES.filter(movie =>
             movie.genre.toLowerCase().includes(genre.toLowerCase()))
        movieList = list.filter(movie => movie.avg_vote >= avg_vote)
    }
    if(country && avg_vote) {
        let list = MOVIES.filter(movie =>
             movie.country.toLowerCase().includes(country.toLowerCase()))
        movieList = list.filter(movie => movie.avg_vote >= avg_vote)
    }
    if(genre && country && avg_vote) {
        let list = MOVIES.filter(movie =>
             movie.country.toLowerCase().includes(country.toLowerCase()))
        let list2 = list.filter(movie =>
             movie.genre.toLowerCase().includes(genre.toLowerCase()))
        movieList = list2.filter(movie => movie.avg_vote >= avg_vote)
    }
    res.send(movieList)
}

app.get('/movie', handleGetMovie)
app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
  })