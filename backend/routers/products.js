const express = require('express');
const router = express.Router();
const { Product } = require('../models/product');
const { Category } = require('../models/category');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    const products = await Product.find().populate('category').select('name image category -_id');
    if (!products) {
        res.status(500).json({ success: false });
    }
    res.send(products);
});

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
        res.status(500).json({ success: false, message: 'Product not found' });
    }
    res.send(product);
});

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid product');
    }
    const category = await Category.findById(req.body.category);

    if (!category) {
        return res.status(400).send('Invalid category');
    }

    const product = await Product.findByIdAndUpdate(req.params.id, {
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
    }, {
        new: true,
    });
    if (!product) {
        res.status(500).json({ success: false, message: 'Product not found' });
    }
    res.send(product);
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

router.delete('/:id', async (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: 'Product deleted successfully' });
        } else {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
    }).catch(err => {
        return res.status(400).json({ success: false, err: err });
    });
});

router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments();
    if (!productCount) {
        res.status(500).json({ success: false });
    }
    res.send({ productCount: productCount });
});

module.exports = router;
