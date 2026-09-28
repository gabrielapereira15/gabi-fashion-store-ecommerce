import { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import Field from '../components/Field';
import { CheckIcon, LockIcon } from '../components/icons';
import { useForm } from '../hooks/useForm';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCents, lineTotalCents } from '../lib/money';
import { productImage } from '../lib/api';
import * as rule from '../lib/validation';
import styles from './Checkout.module.css';

const RULES = {
    name: rule.required('Name'),
    email: rule.email,
    address: rule.required('Address'),
    city: rule.required('City'),
    postcode: rule.required('Postal code'),
    phone: rule.phone,
    creditCard: rule.creditCard,
    expiration: rule.expiry,
    cvc: rule.cvc
};

const deliveryWindow = () => {
    const from = new Date();
    from.setDate(from.getDate() + 3);
    const to = new Date();
    to.setDate(to.getDate() + 6);

    const format = (date) =>
        date.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });

    return `${format(from)} – ${format(to)}`;
};

export default function Checkout() {
    const { items, totals, isEmpty, clearCart } = useCart();
    const { user } = useAuth();
    const toast = useToast();

    const [placedOrder, setPlacedOrder] = useState(null);
    // Snapshot the bag at submit time so the receipt survives clearing it.
    const confirmationRef = useRef(null);

    const form = useForm(
        {
            name: user?.name ?? '',
            email: user?.email ?? '',
            address: user?.address ?? '',
            city: '',
            postcode: '',
            phone: user?.phone ?? '',
            creditCard: '',
            expiration: '',
            cvc: ''
        },
        RULES
    );

    useEffect(() => {
        confirmationRef.current?.focus();
    }, [placedOrder]);

    // Reaching /checkout directly with an empty bag is a dead end, so send
    // them to the cart instead of rendering a form that cannot be submitted.
    if (isEmpty && !placedOrder) {
        return <Navigate to="/cart" replace />;
    }

    const onSubmit = form.handleSubmit(async (values) => {
        // No payment is taken — this is a demo checkout.
        const order = {
            reference: `GFS-${Date.now().toString(36).toUpperCase().slice(-6)}`,
            items,
            totals,
            email: values.email,
            delivery: deliveryWindow()
        };

        setPlacedOrder(order);
        clearCart();
        toast.success('Order placed. Thank you!');
    });

    if (placedOrder) {
        return (
            <div className={`page ${styles.confirmation}`}>
                <div className={styles.tick}>
                    <CheckIcon width={30} height={30} />
                </div>

                <h1 tabIndex={-1} ref={confirmationRef} className={styles.confirmTitle}>
                    Thank you for your order
                </h1>
                <p className={styles.confirmCopy}>
                    We have sent a confirmation to <strong>{placedOrder.email}</strong>. Your order
                    reference is <strong>{placedOrder.reference}</strong>.
                </p>

                <dl className={styles.confirmMeta}>
                    <div>
                        <dt>Estimated delivery</dt>
                        <dd>{placedOrder.delivery}</dd>
                    </div>
                    <div>
                        <dt>Total paid</dt>
                        <dd>{formatCents(placedOrder.totals.total)}</dd>
                    </div>
                    <div>
                        <dt>Items</dt>
                        <dd>{placedOrder.items.reduce((sum, item) => sum + item.quantity, 0)}</dd>
                    </div>
                </dl>

                <Link className="btn btn--primary" to="/">
                    Continue shopping
                </Link>

                <p className={styles.demoNote}>
                    This is a portfolio demo — no payment was processed and no order was shipped.
                </p>
            </div>
        );
    }

    return (
        <div className={`page ${styles.wrap}`}>
            <header className={styles.head}>
                <p className="eyebrow">Checkout</p>
                <h1 className={styles.title}>Almost yours</h1>
            </header>

            <div className={styles.layout}>
                <form className={styles.form} onSubmit={onSubmit} noValidate>
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Contact</legend>
                        <div className={styles.grid}>
                            <Field
                                label="Full name"
                                autoComplete="name"
                                className={styles.span2}
                                {...form.fieldProps('name')}
                            />
                            <Field
                                label="Email"
                                type="email"
                                autoComplete="email"
                                {...form.fieldProps('email')}
                            />
                            <Field
                                label="Phone"
                                type="tel"
                                autoComplete="tel"
                                placeholder="250-870-0000"
                                {...form.fieldProps('phone')}
                            />
                        </div>
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Delivery</legend>
                        <div className={styles.grid}>
                            <Field
                                label="Address"
                                autoComplete="street-address"
                                className={styles.span2}
                                {...form.fieldProps('address')}
                            />
                            <Field
                                label="City"
                                autoComplete="address-level2"
                                {...form.fieldProps('city')}
                            />
                            <Field
                                label="Postal code"
                                autoComplete="postal-code"
                                placeholder="N2H 3W5"
                                {...form.fieldProps('postcode')}
                            />
                        </div>
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>Payment</legend>
                        <p className={styles.demoCard}>
                            <LockIcon />
                            Demo only — try <code>4242 4242 4242 4242</code>. Nothing is charged.
                        </p>
                        <div className={styles.grid}>
                            <Field
                                label="Card number"
                                inputMode="numeric"
                                autoComplete="cc-number"
                                placeholder="4242 4242 4242 4242"
                                className={styles.span2}
                                {...form.fieldProps('creditCard')}
                            />
                            <Field
                                label="Expiry"
                                placeholder="MM/YY"
                                autoComplete="cc-exp"
                                {...form.fieldProps('expiration')}
                            />
                            <Field
                                label="Security code"
                                inputMode="numeric"
                                autoComplete="cc-csc"
                                placeholder="123"
                                {...form.fieldProps('cvc')}
                            />
                        </div>
                    </fieldset>

                    <button
                        type="submit"
                        className="btn btn--primary btn--block"
                        disabled={form.submitting}
                    >
                        {form.submitting ? 'Placing order…' : `Pay ${formatCents(totals.total)}`}
                    </button>
                </form>

                <aside className={styles.summary} aria-label="Order summary">
                    <h2 className={styles.summaryTitle}>Your order</h2>

                    <ul className={styles.items}>
                        {items.map((item) => (
                            <li key={item.productId}>
                                <img
                                    src={productImage(item)}
                                    alt={item.productName}
                                    width={56}
                                    height={75}
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div>
                                    <p className={styles.itemName}>{item.productName}</p>
                                    <p className={styles.itemMeta}>
                                        {item.productColor} · Qty {item.quantity}
                                    </p>
                                </div>
                                <span className={styles.itemPrice}>
                                    {formatCents(lineTotalCents(item))}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <dl className={styles.rows}>
                        <div>
                            <dt>Subtotal</dt>
                            <dd>{formatCents(totals.subtotal)}</dd>
                        </div>
                        <div>
                            <dt>Shipping</dt>
                            <dd>
                                {totals.shipping === 0 ? 'Free' : formatCents(totals.shipping)}
                            </dd>
                        </div>
                        <div>
                            <dt>HST (13%)</dt>
                            <dd>{formatCents(totals.tax)}</dd>
                        </div>
                    </dl>

                    <div className={styles.total}>
                        <span>Total</span>
                        <span>{formatCents(totals.total)}</span>
                    </div>

                    <p className={styles.delivery}>Estimated delivery {deliveryWindow()}</p>

                    <Link className={styles.back} to="/cart">
                        Edit your bag
                    </Link>
                </aside>
            </div>
        </div>
    );
}
