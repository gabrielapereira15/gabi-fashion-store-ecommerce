import axios from 'axios';
import { demoProducts } from '../data/demoProducts';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' }
});

/** Pulls the server's message out of an axios error, with a readable fallback. */
export function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
    if (error?.response?.data?.error) return error.response.data.error;
    if (error?.code === 'ECONNABORTED') return 'The server took too long to respond.';
    if (error?.message === 'Network Error') return 'Could not reach the server.';
    return error?.message || fallback;
}

/**
 * True when the API is unreachable rather than returning an error status —
 * the case where falling back to demo data is the right move.
 */
const isOffline = (error) =>
    !error?.response || error.code === 'ECONNABORTED' || error.message === 'Network Error';

/**
 * Fetches the catalogue, falling back to the bundled demo data when the API
 * is unreachable or unseeded.
 *
 * Returns `{ products, source, reason }` — `source` is 'api' or 'demo', and on
 * demo data `reason` is 'offline' (no server) or 'empty' (server up, no seed),
 * which are different problems with different fixes.
 */
export async function fetchProducts() {
    try {
        const { data } = await api.get('/products');

        // An empty collection means the seed has not been run; demo data is
        // more useful than an empty shop.
        if (!Array.isArray(data) || data.length === 0) {
            return { products: demoProducts, source: 'demo', reason: 'empty' };
        }

        return { products: data, source: 'api', reason: null };
    } catch (error) {
        if (isOffline(error)) {
            return { products: demoProducts, source: 'demo', reason: 'offline' };
        }
        throw error;
    }
}

export const productsApi = {
    list: () => api.get('/products').then((r) => r.data),
    create: (product) => api.post('/products', product).then((r) => r.data),
    update: (productId, product) => api.put(`/products/${productId}`, product).then((r) => r.data),
    remove: (productId) => api.delete(`/products/${productId}`).then((r) => r.data)
};

export const authApi = {
    register: (payload) => api.post('/auth/register', payload).then((r) => r.data.user),
    login: (payload) => api.post('/auth/login', payload).then((r) => r.data.user)
};

/** Image path for a product, with a shared placeholder when one is missing. */
export const productImage = (product) =>
    product?.productId ? `/images/${String(product.productId).toLowerCase()}.webp` : '/placeholder.svg';
