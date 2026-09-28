/**
 * Form validation.
 *
 * Each rule returns an error string or null, so a form can validate a single
 * field on blur and the whole object on submit using the same definitions.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts 250-870-0000, (250) 870 0000, +1 250 870 0000, 2508700000.
const PHONE = /^\+?\d{0,2}[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
const CARD = /^\d{13,19}$/;
const EXPIRY = /^(0[1-9]|1[0-2])\s?\/\s?(\d{2}|\d{4})$/;

export const required = (label) => (value) =>
    String(value ?? '').trim() ? null : `${label} is required.`;

export const email = (value) => {
    if (!String(value ?? '').trim()) return 'Email is required.';
    return EMAIL.test(value.trim()) ? null : 'Enter a valid email address.';
};

export const password = (value) => {
    if (!value) return 'Password is required.';
    return value.length >= 8 ? null : 'Use at least 8 characters.';
};

export const phone = (value) => {
    if (!String(value ?? '').trim()) return 'Phone number is required.';
    return PHONE.test(value.trim()) ? null : 'Enter a valid phone number, e.g. 250-870-0000.';
};

export const creditCard = (value) => {
    const digits = String(value ?? '').replace(/\s/g, '');
    if (!digits) return 'Card number is required.';
    if (!CARD.test(digits)) return 'Enter a card number between 13 and 19 digits.';
    return luhn(digits) ? null : 'That card number is not valid.';
};

export const expiry = (value) => {
    const raw = String(value ?? '').trim();
    if (!raw) return 'Expiry date is required.';
    if (!EXPIRY.test(raw)) return 'Use MM/YY.';

    const [month, yearPart] = raw.split('/').map((part) => part.trim());
    const year = yearPart.length === 2 ? 2000 + Number(yearPart) : Number(yearPart);

    // Compare against the last day of the expiry month.
    const expiresAt = new Date(year, Number(month), 0, 23, 59, 59);
    return expiresAt >= new Date() ? null : 'That card has expired.';
};

export const cvc = (value) => {
    const raw = String(value ?? '').trim();
    if (!raw) return 'Security code is required.';
    return /^\d{3,4}$/.test(raw) ? null : 'Enter the 3 or 4 digit code.';
};

/** Standard Luhn checksum — catches most mistyped card numbers. */
function luhn(digits) {
    let sum = 0;
    let double = false;

    for (let i = digits.length - 1; i >= 0; i -= 1) {
        let value = Number(digits[i]);
        if (double) {
            value *= 2;
            if (value > 9) value -= 9;
        }
        sum += value;
        double = !double;
    }

    return sum % 10 === 0;
}

/**
 * Runs a `{ field: rule }` map over `values`.
 * Returns `{ errors, isValid }`.
 */
export function validate(values, rules) {
    const errors = {};

    for (const [field, rule] of Object.entries(rules)) {
        const error = rule(values[field], values);
        if (error) errors[field] = error;
    }

    return { errors, isValid: Object.keys(errors).length === 0 };
}
