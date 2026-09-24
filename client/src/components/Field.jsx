import { useId } from 'react';
import styles from './Field.module.css';

/**
 * A labelled input that shows its own inline error.
 *
 * The error is wired with aria-describedby + aria-invalid so screen readers
 * announce it — the original forms used alert() for this.
 */
export default function Field({
    label,
    error,
    hint,
    as = 'input',
    className = '',
    ...inputProps
}) {
    const id = useId();
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const Tag = as;

    const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ');

    return (
        <div className={`${styles.field} ${className}`}>
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>

            <Tag
                id={id}
                className={`${styles.input} ${error ? styles.invalid : ''}`}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={describedBy || undefined}
                {...inputProps}
            />

            {hint && !error && (
                <p id={hintId} className={styles.hint}>
                    {hint}
                </p>
            )}

            {error && (
                <p id={errorId} className={styles.error}>
                    {error}
                </p>
            )}
        </div>
    );
}
