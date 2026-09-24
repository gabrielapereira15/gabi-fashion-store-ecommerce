import styles from './ProductGridSkeleton.module.css';

/** Placeholder cards shown while the catalogue loads. */
export default function ProductGridSkeleton({ count = 8 }) {
    return (
        <div className={styles.grid} aria-hidden="true">
            {Array.from({ length: count }, (_, index) => (
                <div key={index} className={styles.card}>
                    <div className={`${styles.media} ${styles.shimmer}`} />
                    <div className={`${styles.line} ${styles.short} ${styles.shimmer}`} />
                    <div className={`${styles.line} ${styles.shimmer}`} />
                    <div className={`${styles.line} ${styles.tiny} ${styles.shimmer}`} />
                </div>
            ))}
        </div>
    );
}
