import styles from './EmptyState.module.css';

/** Shared empty / error state: an icon, a line of copy, and one way forward. */
export default function EmptyState({ icon, title, description, action, tone = 'neutral' }) {
    return (
        <div className={`${styles.empty} ${styles[tone]}`}>
            {icon && <div className={styles.icon}>{icon}</div>}
            <h2 className={styles.title}>{title}</h2>
            {description && <p className={styles.description}>{description}</p>}
            {action && <div className={styles.action}>{action}</div>}
        </div>
    );
}
