import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { orderTotals } from '../lib/money';

const STORAGE_KEY = 'gfs.cart.v1';
const MAX_QUANTITY = 99;

const CartContext = createContext(null);

/** Reads the saved cart. Storage can throw in private mode, so never trust it. */
function loadCart() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        // Drop anything that does not look like a cart line.
        return parsed.filter(
            (item) => item && item.productId && Number.isFinite(Number(item.value))
        );
    } catch {
        return [];
    }
}

const clampQuantity = (value) => {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) return 1;
    return Math.min(Math.max(parsed, 1), MAX_QUANTITY);
};

function cartReducer(state, action) {
    switch (action.type) {
        case 'add': {
            const { product, quantity = 1 } = action;
            const existing = state.find((item) => item.productId === product.productId);

            if (existing) {
                return state.map((item) =>
                    item.productId === product.productId
                        ? { ...item, quantity: clampQuantity(item.quantity + quantity) }
                        : item
                );
            }

            // Store only what the cart renders, so a later catalogue edit
            // cannot reshape a saved cart line.
            return [
                ...state,
                {
                    productId: product.productId,
                    productName: product.productName,
                    productType: product.productType,
                    productColor: product.productColor,
                    value: product.value,
                    quantity: clampQuantity(quantity)
                }
            ];
        }

        case 'setQuantity':
            return state.map((item) =>
                item.productId === action.productId
                    ? { ...item, quantity: clampQuantity(action.quantity) }
                    : item
            );

        case 'remove':
            return state.filter((item) => item.productId !== action.productId);

        case 'clear':
            return [];

        default:
            return state;
    }
}

export function CartProvider({ children }) {
    const [items, dispatch] = useReducer(cartReducer, undefined, loadCart);

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // Storage unavailable (private mode, blocked cookies) — the cart
            // still works for this session.
        }
    }, [items]);

    const value = useMemo(() => {
        const totals = orderTotals(items);

        return {
            items,
            totals,
            /** Total garments, not total lines — what the nav badge shows. */
            count: items.reduce((sum, item) => sum + item.quantity, 0),
            isEmpty: items.length === 0,
            addItem: (product, quantity) => dispatch({ type: 'add', product, quantity }),
            setQuantity: (productId, quantity) =>
                dispatch({ type: 'setQuantity', productId, quantity }),
            removeItem: (productId) => dispatch({ type: 'remove', productId }),
            clearCart: () => dispatch({ type: 'clear' }),
            hasItem: (productId) => items.some((item) => item.productId === productId)
        };
    }, [items]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used inside a <CartProvider>');
    }
    return context;
}
