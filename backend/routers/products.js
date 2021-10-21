const express = require('express');
const router = express.Router();
const { Product } = require('../models/product');
const { Category } = require('../models/category');

router.get('/', async (req, res) => {
    const products = await Product.find();
    if (!products) {
        res.status(500).json({ success: false });
    }
    res.send(products);
});

router.post('/', async (req, res) => {
    const category = await Category.findById(req.body.category);

    if (!category) {
        return res.status(400).send('Invalid category');
    }

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: category.id,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });

    product = await product.save();

    if (!product) {
        return res.status(500).send('The product cannot be created');
    }

    res.send(product);
});

module.exports = router;
