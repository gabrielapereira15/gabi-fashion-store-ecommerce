const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const createApp = require('../app');
const Product = require('../models/Product');
const User = require('../models/User');

let mongo;
let app;

const sampleProduct = {
    productId: 'suit1',
    productName: 'Saffron Track Set',
    productType: 'Loungewear',
    productColor: 'Saffron',
    value: 128
};

const sampleUser = {
    name: 'Ada Lovelace',
    address: '15 Example Street, Ottawa',
    phone: '250-870-0000',
    email: 'ada@example.com',
    password: 'correct-horse-battery'
};

test.before(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
    app = createApp();
});

test.after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongo.stop();
});

test.beforeEach(async () => {
    await Product.deleteMany({});
    await User.deleteMany({});
});

test('GET /api/health reports ok', async () => {
    const resp = await request(app).get('/api/health').expect(200);
    assert.equal(resp.body.status, 'ok');
});

test('unknown routes return a 404 payload rather than HTML', async () => {
    const resp = await request(app).get('/api/nope').expect(404);
    assert.match(resp.body.error, /Route not found/);
});

test.describe('products', () => {
    test('creates, lists, updates and deletes a product', async () => {
        const created = await request(app).post('/api/products').send(sampleProduct).expect(201);
        assert.equal(created.body.productName, 'Saffron Track Set');

        const listed = await request(app).get('/api/products').expect(200);
        assert.equal(listed.body.length, 1);

        const updated = await request(app)
            .put('/api/products/suit1')
            .send({ value: 99 })
            .expect(200);
        assert.equal(updated.body.value, 99);
        // Fields left out of the body keep their previous value.
        assert.equal(updated.body.productName, 'Saffron Track Set');

        await request(app).delete('/api/products/suit1').expect(200);
        await request(app).get('/api/products/suit1').expect(404);
    });

    test('rejects a product with a negative price', async () => {
        const resp = await request(app)
            .post('/api/products')
            .send({ ...sampleProduct, value: -5 })
            .expect(400);
        assert.match(resp.body.error, /negative/);
    });

    test('rejects a duplicate productId with 409', async () => {
        await request(app).post('/api/products').send(sampleProduct).expect(201);
        await request(app).post('/api/products').send(sampleProduct).expect(409);
    });

    test('updating a product that does not exist returns 404', async () => {
        await request(app).put('/api/products/ghost').send({ value: 10 }).expect(404);
    });

    test('stores a photo, as a bundled path or an absolute URL', async () => {
        await request(app)
            .post('/api/products')
            .send({ ...sampleProduct, image: '/images/suit7.webp' })
            .expect(201);

        const listed = await request(app).get('/api/products/suit1').expect(200);
        assert.equal(listed.body.image, '/images/suit7.webp');

        const updated = await request(app)
            .put('/api/products/suit1')
            .send({ image: 'https://example.com/dress.jpg' })
            .expect(200);
        assert.equal(updated.body.image, 'https://example.com/dress.jpg');
    });

    test('defaults the photo to an empty string when none is given', async () => {
        const created = await request(app).post('/api/products').send(sampleProduct).expect(201);
        // The client then falls back to /images/<productId>.webp.
        assert.equal(created.body.image, '');
    });

    test('rejects a photo that is neither a URL nor a rooted path', async () => {
        const resp = await request(app)
            .post('/api/products')
            .send({ ...sampleProduct, image: 'javascript:alert(1)' })
            .expect(400);
        assert.match(resp.body.error, /absolute URL or a path/);
    });
});

test.describe('auth', () => {
    test('registers a user and never returns the password', async () => {
        const resp = await request(app).post('/api/auth/register').send(sampleUser).expect(201);
        assert.equal(resp.body.user.email, 'ada@example.com');
        assert.equal(resp.body.user.password, undefined);
    });

    test('stores the password hashed, not in plain text', async () => {
        await request(app).post('/api/auth/register').send(sampleUser).expect(201);

        const stored = await User.findOne({ email: sampleUser.email }).select('+password');
        assert.notEqual(stored.password, sampleUser.password);
        assert.match(stored.password, /^\$2[aby]\$/);
    });

    test('logs in with the right password and rejects the wrong one', async () => {
        await request(app).post('/api/auth/register').send(sampleUser).expect(201);

        const ok = await request(app)
            .post('/api/auth/login')
            .send({ email: sampleUser.email, password: sampleUser.password })
            .expect(200);
        assert.equal(ok.body.user.name, 'Ada Lovelace');

        await request(app)
            .post('/api/auth/login')
            .send({ email: sampleUser.email, password: 'wrong' })
            .expect(401);
    });

    test('gives the same error for an unknown email as for a bad password', async () => {
        await request(app).post('/api/auth/register').send(sampleUser).expect(201);

        const unknown = await request(app)
            .post('/api/auth/login')
            .send({ email: 'nobody@example.com', password: 'whatever' })
            .expect(401);
        const badPassword = await request(app)
            .post('/api/auth/login')
            .send({ email: sampleUser.email, password: 'wrong' })
            .expect(401);

        assert.equal(unknown.body.error, badPassword.body.error);
    });

    test('rejects a password shorter than 8 characters', async () => {
        const resp = await request(app)
            .post('/api/auth/register')
            .send({ ...sampleUser, password: 'short' })
            .expect(400);
        assert.match(resp.body.error, /at least 8/);
    });

    test('rejects a duplicate email with 409', async () => {
        await request(app).post('/api/auth/register').send(sampleUser).expect(201);
        await request(app).post('/api/auth/register').send(sampleUser).expect(409);
    });
});

test.describe('users', () => {
    test('GET /api/users never leaks password hashes', async () => {
        await request(app).post('/api/auth/register').send(sampleUser).expect(201);

        const resp = await request(app).get('/api/users').expect(200);
        assert.equal(resp.body.length, 1);
        assert.equal(resp.body[0].password, undefined);
    });

    test('fetches a user by the email in the URL', async () => {
        await request(app).post('/api/auth/register').send(sampleUser).expect(201);

        const resp = await request(app).get(`/api/users/${sampleUser.email}`).expect(200);
        assert.equal(resp.body.name, 'Ada Lovelace');

        await request(app).get('/api/users/nobody@example.com').expect(404);
    });

    test('PUT updates the user named in the URL, not one named in the body', async () => {
        await request(app).post('/api/auth/register').send(sampleUser).expect(201);
        await request(app)
            .post('/api/auth/register')
            .send({ ...sampleUser, email: 'grace@example.com', name: 'Grace Hopper' })
            .expect(201);

        // A body carrying a different email must not redirect the update.
        await request(app)
            .put(`/api/users/${sampleUser.email}`)
            .send({ name: 'Ada L.', email: 'grace@example.com' })
            .expect(200);

        const ada = await User.findOne({ email: sampleUser.email });
        const grace = await User.findOne({ email: 'grace@example.com' });
        assert.equal(ada.name, 'Ada L.');
        assert.equal(grace.name, 'Grace Hopper');
    });

    test('re-hashes a password supplied through PUT', async () => {
        await request(app).post('/api/auth/register').send(sampleUser).expect(201);

        await request(app)
            .put(`/api/users/${sampleUser.email}`)
            .send({ password: 'a-brand-new-secret' })
            .expect(200);

        const stored = await User.findOne({ email: sampleUser.email }).select('+password');
        assert.notEqual(stored.password, 'a-brand-new-secret');

        await request(app)
            .post('/api/auth/login')
            .send({ email: sampleUser.email, password: 'a-brand-new-secret' })
            .expect(200);
    });

    test('deletes the user named in the URL', async () => {
        await request(app).post('/api/auth/register').send(sampleUser).expect(201);

        await request(app).delete(`/api/users/${sampleUser.email}`).expect(200);
        await request(app).get(`/api/users/${sampleUser.email}`).expect(404);
        await request(app).delete(`/api/users/${sampleUser.email}`).expect(404);
    });
});
