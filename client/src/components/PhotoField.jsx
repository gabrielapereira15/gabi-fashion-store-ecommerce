import { useId } from 'react';
import { bundledImages } from '../lib/api';
import { CheckIcon } from './icons';
import styles from './PhotoField.module.css';

/**
 * Picks a product photo: one of the images bundled with the client, or any
 * image URL. The value is the string stored on `product.image` — an empty
 * string means "fall back to /images/<productId>.webp".
 */
export default function PhotoField({ value, onChange, error, productId }) {
    const id = useId();
    const urlId = `${id}-url`;
    const errorId = `${id}-error`;

    // A value that is not one of the bundled paths came from the URL box.
    const isBundled = bundledImages.some((image) => image.path === value);
    const urlValue = value && !isBundled ? value : '';

    // What the shop will actually render, so the preview matches reality.
    const effective =
        value || (productId ? `/images/${productId.trim().toLowerCase()}.webp` : '');

    return (
        <div className={styles.field}>
            <span className={styles.label} id={id}>
                Photo
            </span>

            <div className={styles.strip} role="group" aria-labelledby={id}>
                {bundledImages.map((image) => {
                    const selected = value === image.path;

                    return (
                        <button
                            key={image.path}
                            type="button"
                            className={`${styles.swatch} ${selected ? styles.selected : ''}`}
                            onClick={() => onChange(selected ? '' : image.path)}
                            aria-pressed={selected}
                            title={image.label}
                        >
                            <img src={image.path} alt={image.label} loading="lazy" />
                            {selected && (
                                <span className={styles.tick}>
                                    <CheckIcon width={14} height={14} />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className={styles.or}>
                <span>or paste a link</span>
            </div>

            <input
                id={urlId}
                type="url"
                className={`${styles.url} ${error ? styles.invalid : ''}`}
                placeholder="https://images.unsplash.com/…"
                value={urlValue}
                onChange={(event) => onChange(event.target.value)}
                aria-label="Image URL"
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? errorId : undefined}
            />

            {error && (
                <p id={errorId} className={styles.error}>
                    {error}
                </p>
            )}

            <div className={styles.previewRow}>
                <div className={styles.preview}>
                    {effective ? (
                        <img src={effective} alt="" />
                    ) : (
                        <span className={styles.previewEmpty}>No photo</span>
                    )}
                </div>
                <p className={styles.previewNote}>
                    {value
                        ? 'This is the photo the shop will show.'
                        : productId
                          ? `No photo chosen — the shop will look for /images/${productId.trim().toLowerCase()}.webp and show a lettered tile if it is missing.`
                          : 'Choose a photo, or leave it empty to use the image named after the product id.'}
                </p>
            </div>
        </div>
    );
}
