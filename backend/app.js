const express = require('express');
const app = express();
const morgan = require('morgan');
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

require('dotenv/config');

const api = process.env.API_URL;
const conString = process.env.CONN_STRING;

app.use(cors());
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

// Routes
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

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
