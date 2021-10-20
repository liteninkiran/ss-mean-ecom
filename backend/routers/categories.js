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

    category = await category.save();

    if (!category) {
        return res.status(404).send('Category cannot be created');
    }

    res.send(category);
});

module.exports = router;
