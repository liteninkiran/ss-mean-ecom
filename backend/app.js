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

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true,
    },
});

const Product = mongoose.model('Product', productSchema);

app.get(`${api}/products`, async (req, res) => {
    const products = await Product.find();
    if (!products) {
        res.status(500).json({ success: false });
    }
    res.send(products);
});

app.post(`${api}/products`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock,
    });

    product.save().then((newProduct) => {
        res.status(201).json(newProduct);
    }).catch((err) => {
        res.status(500).json({
            success: false,
            error: err,
        });
    });
});

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
