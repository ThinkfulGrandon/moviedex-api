require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIES = require('./movies.json');

const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());

// console.log(process.env.API_TOKEN)

app.use(function validateBearerToken(req, res, next) {
    const bearerToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;
    if(!bearerToken || bearerToken.split(" ")[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized Request'})
    }
    next()
});

function handleGetMovie(req, res) {
    const { genre, country, vote } = req.query;
    let movieList;
    if(!genre && !country && !vote) {
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
    if(vote) {
        movieList = MOVIES.filter(movie =>
             movie.avg_vote >= vote)
    }
    if(genre && vote) {
        let list = MOVIES.filter(movie =>
             movie.genre.toLowerCase().includes(genre.toLowerCase()))
        movieList = list.filter(movie => movie.avg_vote >= vote)
    }
    if(country && vote) {
        let list = MOVIES.filter(movie =>
             movie.country.toLowerCase().includes(country.toLowerCase()))
        movieList = list.filter(movie => movie.avg_vote >= vote)
    }
    if(genre && country && vote) {
        let list = MOVIES.filter(movie =>
             movie.country.toLowerCase().includes(country.toLowerCase()))
        let list2 = list.filter(movie =>
             movie.genre.toLowerCase().includes(genre.toLowerCase()))
        movieList = list2.filter(movie => movie.avg_vote >= vote)
    }
    // let movieList = MOVIES
    res.send(movieList)
}

app.get('/movie', handleGetMovie)

app.listen(8000, () => {
    console.log('Port started on 8000')
})