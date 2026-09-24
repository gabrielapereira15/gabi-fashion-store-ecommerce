import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BagIcon, CloseIcon, MenuIcon, MoonIcon, SunIcon, UserIcon } from './icons';
import styles from './Navbar.module.css';

const LINKS = [
    { to: '/', label: 'Shop', end: true },
    { to: '/admin', label: 'Admin' }
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { count } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const { resolved, toggle } = useTheme();
    const location = useLocation();

    // Close the drawer on navigation.
    useEffect(() => setOpen(false), [location.pathname]);

    // Lock body scroll while the drawer is open.
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    useEffect(() => {
        const onKeyDown = (event) => event.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <nav className={styles.nav} aria-label="Main">
                <Link to="/" className={styles.logo}>
                    Gabi<span>Fashion Store</span>
                </Link>

                <ul className={styles.links}>
                    {LINKS.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                end={link.end}
                                className={({ isActive }) =>
                                    `${styles.link} ${isActive ? styles.active : ''}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className={styles.actions}>
                    {isAuthenticated ? (
                        <div className={styles.account}>
                            <span className={styles.greeting}>
                                <UserIcon />
                                {user.name.split(' ')[0]}
                            </span>
                            <button type="button" className={styles.signOut} onClick={logout}>
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <NavLink to="/login" className={styles.link}>
                            Sign in
                        </NavLink>
                    )}

                    <button
                        type="button"
                        className={styles.themeBtn}
                        onClick={toggle}
                        aria-label={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} theme`}
                        title={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} theme`}
                    >
                        {resolved === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </button>

                    <NavLink
                        to="/cart"
                        className={styles.cart}
                        aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
                    >
                        <BagIcon />
                        {count > 0 && <span className={styles.badge}>{count > 99 ? '99+' : count}</span>}
                    </NavLink>

                    <button
                        type="button"
                        className={styles.menuBtn}
                        onClick={() => setOpen((value) => !value)}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label={open ? 'Close menu' : 'Open menu'}
                    >
                        {open ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </nav>

            <div
                id="mobile-menu"
                className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
                hidden={!open}
            >
                <ul>
                    {LINKS.map((link) => (
                        <li key={link.to}>
                            <NavLink to={link.to} end={link.end} className={styles.drawerLink}>
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                    <li>
                        {isAuthenticated ? (
                            <button type="button" className={styles.drawerLink} onClick={logout}>
                                Sign out
                            </button>
                        ) : (
                            <NavLink to="/login" className={styles.drawerLink}>
                                Sign in
                            </NavLink>
                        )}
                    </li>
                </ul>
            </div>

            {open && <div className={styles.scrim} onClick={() => setOpen(false)} aria-hidden="true" />}
        </header>
    );
}
