import { useState } from 'react';
import { productImage } from '../lib/api';
import styles from './ProductImage.module.css';

/**
 * A product photo that degrades to a lettered tile when the image is missing.
 *
 * Every surface that shows a product uses this, so a piece created in the
 * admin panel without a photo never renders a broken-image icon.
 */
export default function ProductImage({
    product,
    className = '',
    width,
    height,
    priority = false,
    ...imgProps
}) {
    const src = productImage(product);
    const [failed, setFailed] = useState(false);

    // Re-try when the source changes, so the admin preview recovers after a
    // bad URL is corrected.
    const [lastSrc, setLastSrc] = useState(src);
    if (src !== lastSrc) {
        setLastSrc(src);
        setFailed(false);
    }

    const label = (product?.productName || '?').trim().charAt(0).toUpperCase();

    if (failed || !src) {
        return (
            <div
                className={`${styles.fallback} ${className}`}
                role="img"
                aria-label={product?.productName || 'No image'}
            >
                <span aria-hidden="true">{label}</span>
            </div>
        );
    }

    return (
        <img
            className={className}
            src={src}
            alt={product?.productName || ''}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onError={() => setFailed(true)}
            {...imgProps}
        />
    );
}
