import { useCallback, useEffect, useState } from 'react';

import Field from '../components/Field';
import PhotoField from '../components/PhotoField';
import ProductImage from '../components/ProductImage';
import EmptyState from '../components/EmptyState';
import { AlertIcon, EditIcon, PlusIcon, TrashIcon, CloseIcon } from '../components/icons';
import { useToast } from '../context/ToastContext';
import { productsApi, errorMessage } from '../lib/api';
import { formatPrice } from '../lib/money';
import styles from './Admin.module.css';

const BLANK = {
    productId: '',
    productName: '',
    productType: '',
    productColor: '',
    value: '',
    description: '',
    image: ''
};

/** Validated inline rather than through useForm — the id rule depends on mode. */
function validateProduct(values, isEditing) {
    const errors = {};

    if (!values.productId.trim()) errors.productId = 'Product id is required.';
    else if (!isEditing && !/^[a-z0-9-]+$/i.test(values.productId.trim()))
        errors.productId = 'Use letters, numbers and dashes only.';

    if (!values.productName.trim()) errors.productName = 'Name is required.';
    if (!values.productType.trim()) errors.productType = 'Type is required.';
    if (!values.productColor.trim()) errors.productColor = 'Colour is required.';

    const value = Number(values.value);
    if (values.value === '' || Number.isNaN(value)) errors.value = 'Price is required.';
    else if (value < 0) errors.value = 'Price cannot be negative.';

    const image = values.image.trim();
    if (image && !/^(https?:\/\/|\/)/.test(image)) {
        errors.image = 'Enter a full URL starting with https://, or pick one above.';
    }

    return errors;
}

export default function Admin() {
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState('loading');
    const [loadError, setLoadError] = useState('');

    const [draft, setDraft] = useState(BLANK);
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null);

    const toast = useToast();
    const isEditing = editingId !== null;

    const load = useCallback(async () => {
        setStatus('loading');
        try {
            setProducts(await productsApi.list());
            setStatus('ready');
        } catch (error) {
            setLoadError(errorMessage(error, 'Could not load products.'));
            setStatus('error');
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const resetForm = () => {
        setDraft(BLANK);
        setErrors({});
        setEditingId(null);
    };

    const startEdit = (product) => {
        setDraft({
            productId: product.productId,
            productName: product.productName,
            productType: product.productType,
            productColor: product.productColor,
            value: String(product.value),
            description: product.description ?? '',
            image: product.image ?? ''
        });
        setErrors({});
        setEditingId(product.productId);
        document.getElementById('product-form')?.scrollIntoView({ block: 'center' });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setDraft((current) => ({ ...current, [name]: value }));
        if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const found = validateProduct(draft, isEditing);
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        const payload = {
            ...draft,
            productId: draft.productId.trim().toLowerCase(),
            value: Number(draft.value),
            image: draft.image.trim()
        };

        setSaving(true);
        try {
            if (isEditing) {
                await productsApi.update(editingId, payload);
                toast.success(`${payload.productName} updated.`);
            } else {
                await productsApi.create(payload);
                toast.success(`${payload.productName} added to the catalogue.`);
            }
            resetForm();
            await load();
        } catch (error) {
            if (error?.response?.status === 409) {
                setErrors({ productId: 'That product id already exists.' });
            } else {
                toast.error(errorMessage(error, 'Could not save the product.'));
            }
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async (product) => {
        try {
            await productsApi.remove(product.productId);
            toast.success(`${product.productName} deleted.`);
            if (editingId === product.productId) resetForm();
            await load();
        } catch (error) {
            toast.error(errorMessage(error, 'Could not delete the product.'));
        } finally {
            setPendingDelete(null);
        }
    };

    return (
        <div className={`page ${styles.wrap}`}>
            <header className={styles.head}>
                <div>
                    <p className="eyebrow">Admin</p>
                    <h1 className={styles.title}>Catalogue</h1>
                    <p className={styles.sub}>
                        A thin UI over the product REST endpoints — create, read, update and
                        delete against the live API.
                    </p>
                </div>
            </header>

            <div className={styles.layout}>
                <section className={styles.tableWrap} aria-label="Products">
                    {status === 'loading' && (
                        <div className={styles.loading}>
                            {Array.from({ length: 6 }, (_, index) => (
                                <div key={index} className={styles.loadingRow} />
                            ))}
                        </div>
                    )}

                    {status === 'error' && (
                        <EmptyState
                            tone="danger"
                            icon={<AlertIcon width={26} height={26} />}
                            title="Could not reach the API"
                            description={`${loadError} The admin page needs the Express server running — it writes to the live database.`}
                            action={
                                <button type="button" className="btn btn--primary" onClick={load}>
                                    Try again
                                </button>
                            }
                        />
                    )}

                    {status === 'ready' && products.length === 0 && (
                        <EmptyState
                            title="No products yet"
                            description="Run npm run seed in the server directory, or add one with the form."
                        />
                    )}

                    {status === 'ready' && products.length > 0 && (
                        <table className={styles.table}>
                            <caption className="visually-hidden">
                                Products in the catalogue, with edit and delete actions
                            </caption>
                            <thead>
                                <tr>
                                    <th scope="col">Piece</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Colour</th>
                                    <th scope="col" className={styles.numeric}>
                                        Price
                                    </th>
                                    <th scope="col">
                                        <span className="visually-hidden">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr
                                        key={product._id}
                                        className={
                                            editingId === product.productId ? styles.editing : ''
                                        }
                                    >
                                        <td>
                                            <div className={styles.piece}>
                                                <ProductImage
                                                    product={product}
                                                    className={styles.thumb}
                                                    width={40}
                                                    height={53}
                                                />
                                                <div>
                                                    <p className={styles.pieceName}>
                                                        {product.productName}
                                                    </p>
                                                    <p className={styles.pieceId}>
                                                        {product.productId}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{product.productType}</td>
                                        <td>{product.productColor}</td>
                                        <td className={styles.numeric}>
                                            {formatPrice(product.value)}
                                        </td>
                                        <td>
                                            <div className={styles.rowActions}>
                                                <button
                                                    type="button"
                                                    className={styles.iconBtn}
                                                    onClick={() => startEdit(product)}
                                                    aria-label={`Edit ${product.productName}`}
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`${styles.iconBtn} ${styles.danger}`}
                                                    onClick={() => setPendingDelete(product)}
                                                    aria-label={`Delete ${product.productName}`}
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>

                <aside>
                    <form
                        id="product-form"
                        className={styles.form}
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <div className={styles.formHead}>
                            <h2 className={styles.formTitle}>
                                {isEditing ? 'Edit piece' : 'New piece'}
                            </h2>
                            {isEditing && (
                                <button
                                    type="button"
                                    className={styles.iconBtn}
                                    onClick={resetForm}
                                    aria-label="Cancel editing"
                                >
                                    <CloseIcon width={16} height={16} />
                                </button>
                            )}
                        </div>

                        <div className={styles.formFields}>
                            <Field
                                label="Product id"
                                name="productId"
                                value={draft.productId}
                                onChange={handleChange}
                                error={errors.productId}
                                disabled={isEditing}
                                placeholder="suit13"
                                hint={
                                    isEditing
                                        ? 'The id cannot be changed.'
                                        : 'Lowercase letters, numbers and dashes. Used in the URL.'
                                }
                            />
                            <Field
                                label="Name"
                                name="productName"
                                value={draft.productName}
                                onChange={handleChange}
                                error={errors.productName}
                                placeholder="Silk Wrap Dress"
                            />
                            <Field
                                label="Type"
                                name="productType"
                                value={draft.productType}
                                onChange={handleChange}
                                error={errors.productType}
                                placeholder="Dresses"
                            />
                            <Field
                                label="Colour"
                                name="productColor"
                                value={draft.productColor}
                                onChange={handleChange}
                                error={errors.productColor}
                                placeholder="Ivory"
                            />
                            <Field
                                label="Price (USD)"
                                name="value"
                                type="number"
                                min="0"
                                step="0.01"
                                inputMode="decimal"
                                value={draft.value}
                                onChange={handleChange}
                                error={errors.value}
                                placeholder="189"
                            />
                            <PhotoField
                                value={draft.image}
                                productId={draft.productId}
                                error={errors.image}
                                onChange={(image) => {
                                    setDraft((current) => ({ ...current, image }));
                                    if (errors.image) {
                                        setErrors((current) => ({ ...current, image: undefined }));
                                    }
                                }}
                            />

                            <Field
                                label="Description"
                                as="textarea"
                                name="description"
                                rows={3}
                                value={draft.description}
                                onChange={handleChange}
                                placeholder="A short line about the piece."
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn--primary btn--block"
                            disabled={saving}
                        >
                            {saving ? (
                                'Saving…'
                            ) : isEditing ? (
                                'Save changes'
                            ) : (
                                <>
                                    <PlusIcon /> Add piece
                                </>
                            )}
                        </button>
                    </form>
                </aside>
            </div>

            {pendingDelete && (
                <div
                    className={styles.dialogScrim}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-title"
                >
                    <div className={styles.dialog}>
                        <h2 id="delete-title" className={styles.dialogTitle}>
                            Delete this piece?
                        </h2>
                        <p className={styles.dialogCopy}>
                            <strong>{pendingDelete.productName}</strong> will be removed from the
                            catalogue. This cannot be undone.
                        </p>
                        <div className={styles.dialogActions}>
                            <button
                                type="button"
                                className="btn btn--secondary"
                                onClick={() => setPendingDelete(null)}
                                autoFocus
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn--danger"
                                onClick={() => confirmDelete(pendingDelete)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
