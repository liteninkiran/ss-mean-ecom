const express = require('express');
const router = express.Router();
const { Product } = require('../models/product');
const { Category } = require('../models/category');
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if (isValid) {
            uploadError = null;
        }
      cb(uploadError, './public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

// Read many
router.get('/', async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        // Example URL: http://localhost:3000/api/v1/products?categories=XXX,YYY,ZZZ
        filter = { category: req.query.categories.split(',') };
    }
    const products = await Product.find(filter).populate('category'); // .select('name image category -_id');
    if (!products) {
        res.status(500).json({ success: false });
    }
    res.send(products);
});

// Read one
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
        res.status(500).json({ success: false, message: 'Product not found' });
    }
    res.send(product);
});

// Update
router.put('/:id', async (req, res) => {

    // Check the ID that is passed in
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid product');
    }

    // Check if category is valid
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid category');

    // Check if product is valid
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid product');

    const file = req.file;
    let filePath;

    if (file) {
        // Create file path
        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        filePath = `${basePath}${fileName}`;
    } else {
        filePath = product.image;
    }

    // Update the record
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: filePath,
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

    if (!updatedProduct) {
        res.status(500).json({ success: false, message: 'Could not save record' });
    }

    res.send(updatedProduct);
});

// Create
router.post('/', uploadOptions.single('image'), async (req, res) => {

    // Store category
    const category = await Category.findById(req.body.category);

    // Check category is valid
    if (!category) {
        return res.status(400).send('Invalid category');
    }

    // Check file has been uploaded
    const file = req.file;
    if (!file) {
        return res.status(400).send('No image in the request');
    }

    // Create file path
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    const filePath = `${basePath}${fileName}`;

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: filePath,
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

// Delete
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

// Read - counts
router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments();
    if (!productCount) {
        res.status(500).json({ success: false });
    }
    res.send({ productCount: productCount });
});

// Read - featured counts
router.get('/get/featured/:count?', async (req, res) => {
    const count = req.params.count ? Number(req.params.count) : 0;
    const products = await Product.find({ isFeatured: true }).limit(count);
    if (!products) {
        res.status(500).json({ success: false });
    }
    res.send({ products: products });
});

module.exports = router;
