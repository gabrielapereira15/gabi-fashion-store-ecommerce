import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const YEAR = new Date().getFullYear();

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.brand}>
                    <p className={styles.logo}>Gabi Fashion Store</p>
                    <p className={styles.tagline}>
                        A full-stack demo boutique built with React, Express and MongoDB.
                    </p>
                </div>

                <nav className={styles.column} aria-label="Shop">
                    <h2 className="eyebrow">Shop</h2>
                    <Link to="/">All pieces</Link>
                    <Link to="/cart">Your bag</Link>
                    <Link to="/admin">Admin</Link>
                </nav>

                <nav className={styles.column} aria-label="Account">
                    <h2 className="eyebrow">Account</h2>
                    <Link to="/login">Sign in</Link>
                    <Link to="/register">Create account</Link>
                </nav>

                <div className={styles.column}>
                    <h2 className="eyebrow">Visit</h2>
                    <address className={styles.address}>
                        15 Wellington Street
                        <br />
                        Kitchener, ON, Canada
                        <br />
                        (226) 899-XXXX
                    </address>
                </div>
            </div>

            <div className={styles.legal}>
                <p>© {YEAR} Gabriela Nascimento Oliveira Pereira</p>
                <p className={styles.note}>
                    Demo project — no real orders are placed and no payment is taken.
                </p>
            </div>
        </footer>
    );
}
