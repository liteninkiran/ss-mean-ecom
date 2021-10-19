const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

require('dotenv/config');

const api = process.env.API_URL;
const conString = process.env.CONN_STRING;

// Middleware
app.use(express.json());
app.use(morgan('tiny'));

app.get(`${api}/products`, (req, res) => {
    const product = {
        id: 1,
        name: 'Hair Dresser',
        image: 'image_url',
    };
    res.send(product);
});

app.post(`${api}/products`, (req, res) => {
    const newProduct = req.body;
    res.json(newProduct);
});

mongoose.connect(conString);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
