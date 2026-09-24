import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import EmptyState from '../components/EmptyState';
import { AlertIcon, ArrowRightIcon } from '../components/icons';
import { fetchProducts, errorMessage } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import styles from './Home.module.css';

const ALL = 'All';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState('loading'); // loading | ready | error
    const [error, setError] = useState('');
    const [source, setSource] = useState('api');
    const [demoReason, setDemoReason] = useState(null);
    const [filter, setFilter] = useState(ALL);

    const { addItem } = useCart();
    const toast = useToast();

    useEffect(() => {
        let active = true;

        async function load() {
            setStatus('loading');
            try {
                const result = await fetchProducts();
                if (!active) return;

                setProducts(result.products);
                setSource(result.source);
                setDemoReason(result.reason);
                setStatus('ready');
            } catch (err) {
                if (!active) return;
                setError(errorMessage(err, 'We could not load the catalogue.'));
                setStatus('error');
            }
        }

        load();
        return () => {
            active = false;
        };
    }, []);

    const categories = useMemo(
        () => [ALL, ...Array.from(new Set(products.map((p) => p.productType))).sort()],
        [products]
    );

    const visible = useMemo(
        () => (filter === ALL ? products : products.filter((p) => p.productType === filter)),
        [products, filter]
    );

    const handleAdd = (product) => {
        addItem(product);
        toast.success(`${product.productName} added to your bag.`);
    };

    return (
        <>
            <section className={styles.hero}>
                <img
                    className={styles.heroImage}
                    src="/images/hero.webp"
                    alt=""
                    width={1920}
                    height={1100}
                    fetchPriority="high"
                    decoding="async"
                />
                <div className={styles.heroInner}>
                    <p className="eyebrow">New season — Autumn 2026</p>
                    <h1 className={styles.heroTitle}>
                        Where fashion
                        <br />
                        meets elegance
                    </h1>
                    <p className={styles.heroCopy}>
                        Considered pieces in natural fabrics, cut to be worn season after season.
                    </p>
                    <a className="btn btn--ink" href="#catalogue">
                        Shop the collection <ArrowRightIcon />
                    </a>
                </div>
            </section>

            <section className={styles.marquee} aria-label="Store highlights">
                <ul>
                    <li>Free shipping over $150</li>
                    <li>30-day returns</li>
                    <li>Ethically sourced fabrics</li>
                    <li>Made in limited runs</li>
                </ul>
            </section>

            <section id="catalogue" className={`page ${styles.catalogue}`}>
                <header className={styles.catalogueHead}>
                    <div>
                        <p className="eyebrow">The collection</p>
                        <h2 className={styles.catalogueTitle}>Our pieces</h2>
                    </div>

                    {status === 'ready' && (
                        <p className={styles.count}>
                            {visible.length} {visible.length === 1 ? 'piece' : 'pieces'}
                        </p>
                    )}
                </header>

                {source === 'demo' && status === 'ready' && (
                    <p className={styles.demoNotice}>
                        <AlertIcon width={16} height={16} />
                        {demoReason === 'empty' ? (
                            <span>
                                Showing the bundled demo catalogue — the API is running but has no
                                products yet. Run <code>npm run seed</code> in the server directory
                                to load live data.
                            </span>
                        ) : (
                            <span>
                                Showing the bundled demo catalogue — the API is not reachable. Start
                                the server and run <code>npm run seed</code> to load live data.
                            </span>
                        )}
                    </p>
                )}

                {status === 'ready' && categories.length > 2 && (
                    <div className={styles.filters} role="group" aria-label="Filter by category">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                className={`${styles.filter} ${filter === category ? styles.filterActive : ''}`}
                                onClick={() => setFilter(category)}
                                aria-pressed={filter === category}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}

                {status === 'loading' && <ProductGridSkeleton />}

                {status === 'error' && (
                    <EmptyState
                        tone="danger"
                        icon={<AlertIcon width={26} height={26} />}
                        title="We could not load the catalogue"
                        description={error}
                        action={
                            <button
                                type="button"
                                className="btn btn--primary"
                                onClick={() => window.location.reload()}
                            >
                                Try again
                            </button>
                        }
                    />
                )}

                {status === 'ready' && visible.length === 0 && (
                    <EmptyState
                        title="Nothing here yet"
                        description={`No pieces in ${filter}.`}
                        action={
                            <button
                                type="button"
                                className="btn btn--secondary"
                                onClick={() => setFilter(ALL)}
                            >
                                Show everything
                            </button>
                        }
                    />
                )}

                {status === 'ready' && visible.length > 0 && (
                    <div className={styles.grid}>
                        {visible.map((product, index) => (
                            <ProductCard
                                key={product._id ?? product.productId}
                                product={product}
                                onAdd={handleAdd}
                                priority={index < 4}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className={styles.editorial}>
                <img
                    className={styles.editorialImage}
                    src="/images/editorial.webp"
                    alt=""
                    width={1600}
                    height={900}
                    loading="lazy"
                    decoding="async"
                />
                <div className={styles.editorialCopy}>
                    <p className="eyebrow">Our promise</p>
                    <h2>Fewer pieces, chosen better</h2>
                    <p>
                        Every garment is produced in a limited run from natural fabrics, so your
                        wardrobe stays small and your favourites last.
                    </p>
                    <Link className="btn btn--primary" to="/register">
                        Join the list
                    </Link>
                </div>
            </section>
        </>
    );
}
