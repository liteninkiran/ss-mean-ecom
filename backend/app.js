const express = require('express');
const app = express();

require('dotenv/config');

const api = process.env.API_URL;

// Middleware
app.use(express.json());

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

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
