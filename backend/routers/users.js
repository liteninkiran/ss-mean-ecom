const express = require('express');
const router = express.Router();
const { User } = require('../models/user');

router.get('/', async (req, res) => {
    const users = await User.find();
    if (!users) {
        res.status(500).json({ success: false });
    }
    res.send(users);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(500).json({ success: false, message: 'User not found' });
    }
    res.send(user);
});

router.put('/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        passwordHash: req.body.password,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    }, {
        new: true,
    });
    if (!user) {
        res.status(500).json({ success: false, message: 'User not found' });
    }
    res.send(user);
});

router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: req.body.password,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });

    await user.save(function(err) {
        if (err) {
          if (err.code === 11000) {
            // Duplicate email
            return res.status(422).send({ succes: false, message: `User with email '${user.email}' already exists` });
          }
    
          // Some other error
          return res.status(422).send(err);
        }
    
        res.send(user);
    });
});

router.delete('/:id', async (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: 'User deleted successfully' });
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    }).catch(err => {
        return res.status(400).json({ success: false, err: err });
    });
});

module.exports = router;
