import { Link, useNavigate } from 'react-router-dom';

import EmptyState from '../components/EmptyState';
import { BagIcon, MinusIcon, PlusIcon, TrashIcon, LockIcon } from '../components/icons';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCents, formatPrice, lineTotalCents, SHIPPING_THRESHOLD_CENTS } from '../lib/money';
import ProductImage from '../components/ProductImage';
import styles from './Cart.module.css';

export default function Cart() {
    const { items, totals, isEmpty, setQuantity, removeItem, clearCart } = useCart();
    const toast = useToast();
    const navigate = useNavigate();

    if (isEmpty) {
        return (
            <div className="page">
                <EmptyState
                    icon={<BagIcon width={26} height={26} />}
                    title="Your bag is empty"
                    description="Once you add a piece it will appear here, and it will still be here when you come back."
                    action={
                        <Link className="btn btn--primary" to="/">
                            Browse the collection
                        </Link>
                    }
                />
            </div>
        );
    }

    const remaining = SHIPPING_THRESHOLD_CENTS - totals.subtotal;

    const handleRemove = (item) => {
        removeItem(item.productId);
        toast.toast(`${item.productName} removed from your bag.`);
    };

    return (
        <div className={`page ${styles.wrap}`}>
            <header className={styles.head}>
                <p className="eyebrow">Your bag</p>
                <h1 className={styles.title}>
                    {items.length} {items.length === 1 ? 'style' : 'styles'} selected
                </h1>
            </header>

            <div className={styles.layout}>
                <section aria-label="Items in your bag">
                    <ul className={styles.list}>
                        {items.map((item) => (
                            <li key={item.productId} className={styles.item}>
                                <ProductImage
                                    product={item}
                                    className={styles.thumb}
                                    width={180}
                                    height={240}
                                />

                                <div className={styles.details}>
                                    <p className={styles.itemType}>{item.productType}</p>
                                    <h2 className={styles.itemName}>{item.productName}</h2>
                                    <p className={styles.itemColor}>{item.productColor}</p>
                                    <p className={styles.unit}>{formatPrice(item.value)} each</p>
                                </div>

                                <div className={styles.controls}>
                                    <div className={styles.stepper}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity(item.productId, item.quantity - 1)
                                            }
                                            disabled={item.quantity <= 1}
                                            aria-label={`Decrease quantity of ${item.productName}`}
                                        >
                                            <MinusIcon />
                                        </button>

                                        <input
                                            type="number"
                                            min="1"
                                            max="99"
                                            inputMode="numeric"
                                            value={item.quantity}
                                            onChange={(event) =>
                                                setQuantity(item.productId, event.target.value)
                                            }
                                            aria-label={`Quantity of ${item.productName}`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity(item.productId, item.quantity + 1)
                                            }
                                            disabled={item.quantity >= 99}
                                            aria-label={`Increase quantity of ${item.productName}`}
                                        >
                                            <PlusIcon />
                                        </button>
                                    </div>

                                    <p className={styles.lineTotal}>
                                        {formatCents(lineTotalCents(item))}
                                    </p>

                                    <button
                                        type="button"
                                        className={styles.remove}
                                        onClick={() => handleRemove(item)}
                                    >
                                        <TrashIcon />
                                        <span>Remove</span>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.listActions}>
                        <Link className="btn btn--ghost" to="/">
                            Continue shopping
                        </Link>
                        <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={() => {
                                clearCart();
                                toast.toast('Your bag has been emptied.');
                            }}
                        >
                            Empty bag
                        </button>
                    </div>
                </section>

                <aside className={styles.summary} aria-label="Order summary">
                    <h2 className={styles.summaryTitle}>Summary</h2>

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

                    {remaining > 0 && (
                        <p className={styles.shippingNudge}>
                            Add {formatCents(remaining)} more for free shipping.
                        </p>
                    )}

                    <button
                        type="button"
                        className="btn btn--primary btn--block"
                        onClick={() => navigate('/checkout')}
                    >
                        Checkout
                    </button>

                    <p className={styles.secure}>
                        <LockIcon />
                        Demo checkout — no payment is taken.
                    </p>
                </aside>
            </div>
        </div>
    );
}
