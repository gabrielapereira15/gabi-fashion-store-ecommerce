const express = require('express');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// `password` is `select: false` on the schema, so it is never in these responses.

/** GET /api/users — list users. */
router.get(
    '/',
    asyncHandler(async (req, resp) => {
        const users = await User.find().sort({ createdAt: -1 });
        resp.json(users);
    })
);

/** GET /api/users/:email — fetch one user by email. */
router.get(
    '/:email',
    asyncHandler(async (req, resp) => {
        const user = await User.findOne({ email: req.params.email.toLowerCase() });

        if (!user) {
            return resp.status(404).json({ error: 'User not found' });
        }

        resp.json(user);
    })
);

/** PUT /api/users/:email — update the user identified by the URL, not the body. */
router.put(
    '/:email',
    asyncHandler(async (req, resp) => {
        const { name, address, phone, password } = req.body;

        const user = await User.findOne({ email: req.params.email.toLowerCase() });

        if (!user) {
            return resp.status(404).json({ error: 'User not found' });
        }

        if (name !== undefined) user.name = name;
        if (address !== undefined) user.address = address;
        if (phone !== undefined) user.phone = phone;
        // Assigning here triggers the pre-save hook, so it is stored hashed.
        if (password !== undefined) user.password = password;

        await user.save();

        resp.json(user.toObject({ transform: (doc, ret) => { delete ret.password; return ret; } }));
    })
);

/** DELETE /api/users/:email — remove a user. */
router.delete(
    '/:email',
    asyncHandler(async (req, resp) => {
        const user = await User.findOneAndDelete({ email: req.params.email.toLowerCase() });

        if (!user) {
            return resp.status(404).json({ error: 'User not found' });
        }

        resp.json({ message: 'User deleted successfully', email: user.email });
    })
);

module.exports = router;
