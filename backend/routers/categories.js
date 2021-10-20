const express = require('express');
const router = express.Router();
const { Category } = require('../models/category');

router.get('/', async (req, res) => {
    const categories = await Category.find();
    if (!categories) {
        res.status(500).json({ success: false });
    }
    res.send(categories);
});

router.post('/', (req, res) => {
    const category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    });

    category.save().then((newCategory) => {
        res.status(201).json(newCategory);
    }).catch((err) => {
        res.status(500).json({
            success: false,
            error: err,
        });
    });
});

module.exports = router;
