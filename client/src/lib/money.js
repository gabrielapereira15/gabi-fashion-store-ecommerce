/**
 * Money helpers.
 *
 * Prices arrive from the API as dollar amounts. Summing them directly produces
 * artefacts like 59.989999999999995, so every total is computed in integer
 * cents and converted back only for display.
 */

const CURRENCY = 'USD';
const LOCALE = 'en-US';

const formatter = new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY
});

/** Dollars -> integer cents. */
export const toCents = (dollars) => Math.round(Number(dollars || 0) * 100);

/** Integer cents -> dollars. */
export const toDollars = (cents) => cents / 100;

/** Formats a dollar amount as currency. */
export const formatPrice = (dollars) => formatter.format(Number(dollars || 0));

/** Formats an integer cent amount as currency. */
export const formatCents = (cents) => formatter.format(toDollars(cents));

/** Line total for a cart item, in cents. */
export const lineTotalCents = (item) => toCents(item.value) * (item.quantity || 0);

/** Subtotal for a list of cart items, in cents. */
export const subtotalCents = (items) =>
    items.reduce((total, item) => total + lineTotalCents(item), 0);

/** Free over $150, otherwise a flat $9.95. */
export const SHIPPING_THRESHOLD_CENTS = 15000;
export const SHIPPING_FLAT_CENTS = 995;

export const shippingCents = (subtotal) =>
    subtotal === 0 || subtotal >= SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;

/** 13% HST — the shop is set in Kitchener, Ontario. */
export const TAX_RATE = 0.13;

export const taxCents = (subtotal) => Math.round(subtotal * TAX_RATE);

/** Every figure the cart and checkout summaries need, in cents. */
export function orderTotals(items) {
    const subtotal = subtotalCents(items);
    const shipping = shippingCents(subtotal);
    const tax = taxCents(subtotal);

    return {
        subtotal,
        shipping,
        tax,
        total: subtotal + shipping + tax
    };
}
