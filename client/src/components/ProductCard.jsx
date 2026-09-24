import { useState } from 'react';
import { formatPrice } from '../lib/money';
import { productImage } from '../lib/api';
import { CheckIcon } from './icons';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, onAdd, priority = false }) {
    const [added, setAdded] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);

    const handleAdd = () => {
        onAdd(product);
        setAdded(true);
        // Brief confirmation on the button itself, so the eye stays on the card.
        setTimeout(() => setAdded(false), 1400);
    };

    return (
        <article className={styles.card}>
            <div className={styles.media}>
                {imageFailed ? (
                    <div className={styles.fallback} aria-hidden="true">
                        {product.productName.charAt(0)}
                    </div>
                ) : (
                    <img
                        src={productImage(product)}
                        alt={product.productName}
                        width={900}
                        height={1200}
                        loading={priority ? 'eager' : 'lazy'}
                        decoding="async"
                        fetchPriority={priority ? 'high' : 'auto'}
                        onError={() => setImageFailed(true)}
                    />
                )}

                <button
                    type="button"
                    className={`${styles.add} ${added ? styles.addDone : ''}`}
                    onClick={handleAdd}
                    aria-label={`Add ${product.productName} to bag`}
                >
                    {added ? (
                        <>
                            <CheckIcon width={15} height={15} /> Added
                        </>
                    ) : (
                        'Add to bag'
                    )}
                </button>
            </div>

            <div className={styles.body}>
                <p className={styles.type}>{product.productType}</p>
                <h3 className={styles.name}>{product.productName}</h3>
                <div className={styles.meta}>
                    <span className={styles.color}>{product.productColor}</span>
                    <span className={styles.price}>{formatPrice(product.value)}</span>
                </div>
            </div>
        </article>
    );
}
