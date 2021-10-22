const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    const users = await User.find().select('-passwordHash');
    if (!users) {
        res.status(500).json({ success: false });
    }
    res.send(users);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
        res.status(500).json({ success: false, message: 'User not found' });
    }
    res.send(user);
});

router.put('/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        // passwordHash: bcrypt.hashSync(req.body.password, 5),
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
        passwordHash: bcrypt.hashSync(req.body.password, 5),
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

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.JWT_SECRET;
    const invalidCreds = 'Invalid credentials';

    if (!user) {
        return res.status(400).send(invalidCreds);
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1d' });
        return res.status(200).send({ user: user.email, token: token });
    } else {
        return res.status(200).send(invalidCreds);
    }
});

module.exports = router;
