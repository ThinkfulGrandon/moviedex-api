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
    const { genre, country, vote } = req.query
    let movieList = MOVIES
    res.send("incoming movies")
}

app.get('/movie', handleGetMovie)

app.listen(8000, () => {
    console.log('Port started on 8000')
})