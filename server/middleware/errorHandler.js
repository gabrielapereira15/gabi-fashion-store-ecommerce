/**
 * Wraps an async route handler so rejected promises reach the error handler
 * instead of hanging the request.
 */
const asyncHandler = (fn) => (req, resp, next) =>
    Promise.resolve(fn(req, resp, next)).catch(next);

function notFound(req, resp) {
    resp.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity.
function errorHandler(error, req, resp, next) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((e) => e.message);
        return resp.status(400).json({ error: messages.join(', ') });
    }

    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0] || 'field';
        return resp.status(409).json({ error: `That ${field} is already registered.` });
    }

    if (error.name === 'CastError') {
        return resp.status(400).json({ error: `Invalid value for ${error.path}.` });
    }

    console.error(error);
    return resp.status(500).json({ error: 'Something went wrong on our side.' });
}

module.exports = { asyncHandler, notFound, errorHandler };
