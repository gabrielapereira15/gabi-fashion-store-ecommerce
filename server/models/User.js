const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
        },
        // Never returned by a query unless explicitly selected.
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false
        }
    },
    { timestamps: true }
);

// Hash the password whenever it is set or changed.
userSchema.pre('save', async function hashPassword(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
