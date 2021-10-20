const express = require('express');
const app = express();
const morgan = require('morgan');
const productsRouter = require('./routers/products');
const mongoose = require('mongoose');

require('dotenv/config');

const api = process.env.API_URL;
const conString = process.env.CONN_STRING;

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(`${api}/products`, productsRouter);

mongoose.connect(conString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'mean-eshop',
}).then(() => {
    console.log('DB connection ready');
}).catch((err) => {
    console.log(err);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
