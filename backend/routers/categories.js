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

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(500).json({ success: false, message: 'Category not found' });
    }
    res.send(category);
});

router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    });

    await category.save(function(err) {
        if (err) {
          if (err.code === 11000) {
            // Duplicate name
            return res.status(422).send({ succes: false, message: `Category '${category.name}' already exists` });
          }
    
          // Some other error
          return res.status(422).send(err);
        }
    
        res.send(category);
    });
});

router.delete('/:id', async (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if (category) {
            return res.status(200).json({ success: true, message: 'Category deleted successfully' });
        } else {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
    }).catch(err => {
        return res.status(400).json({ success: false, err: err });
    });
});

module.exports = router;
