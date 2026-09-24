const express = require('express');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/** Shape sent to the client. Never includes the password hash. */
const publicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    address: user.address,
    phone: user.phone
});

/** POST /api/auth/register — create an account. */
router.post(
    '/register',
    asyncHandler(async (req, resp) => {
        const { name, address, phone, email, password } = req.body;

        if (!name || !address || !phone || !email || !password) {
            return resp.status(400).json({ error: 'All fields are required.' });
        }

        const user = await User.create({ name, address, phone, email, password });

        resp.status(201).json({ user: publicUser(user) });
    })
);

/** POST /api/auth/login — verify credentials. */
router.post(
    '/login',
    asyncHandler(async (req, resp) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return resp.status(400).json({ error: 'Email and password are required.' });
        }

        // `password` is select:false, so it must be requested explicitly.
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        // One message for both branches so the response never reveals
        // whether an email is registered.
        const invalid = { error: 'Invalid email or password.' };

        if (!user) {
            return resp.status(401).json(invalid);
        }

        const matches = await user.comparePassword(password);

        if (!matches) {
            return resp.status(401).json(invalid);
        }

        resp.json({ user: publicUser(user) });
    })
);

module.exports = router;
