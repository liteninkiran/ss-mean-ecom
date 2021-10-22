const express = require('express');
const app = express();
const morgan = require('morgan');
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const usersRouter = require('./routers/users');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');

const api = process.env.API_URL;
const conString = process.env.CONN_STRING;

app.use(cors());
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);

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
