import { AlertIcon, CheckIcon, CloseIcon, InfoIcon } from './icons';
import styles from './ToastStack.module.css';

const ICONS = {
    success: CheckIcon,
    error: AlertIcon,
    info: InfoIcon
};

export default function ToastStack({ toasts, onDismiss }) {
    if (toasts.length === 0) return null;

    return (
        <div className={styles.stack} role="region" aria-label="Notifications">
            {toasts.map(({ id, message, variant }) => {
                const Icon = ICONS[variant] ?? InfoIcon;

                return (
                    <output
                        key={id}
                        className={`${styles.toast} ${styles[variant]}`}
                        // Errors interrupt; confirmations wait their turn.
                        aria-live={variant === 'error' ? 'assertive' : 'polite'}
                    >
                        <Icon width={18} height={18} className={styles.icon} />
                        <span className={styles.message}>{message}</span>
                        <button
                            type="button"
                            className={styles.close}
                            onClick={() => onDismiss(id)}
                            aria-label="Dismiss notification"
                        >
                            <CloseIcon width={14} height={14} />
                        </button>
                    </output>
                );
            })}
        </div>
    );
}
