import { Link, useNavigate } from 'react-router-dom';

import Field from '../components/Field';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { errorMessage } from '../lib/api';
import * as rule from '../lib/validation';
import styles from './Auth.module.css';

const RULES = {
    name: rule.required('Name'),
    address: rule.required('Address'),
    phone: rule.phone,
    email: rule.email,
    password: rule.password
};

const INITIAL = { name: '', address: '', phone: '', email: '', password: '' };

export default function Register() {
    const { register } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const form = useForm(INITIAL, RULES);

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            const account = await register(values);
            toast.success(`Welcome to the store, ${account.name.split(' ')[0]}.`);
            navigate('/');
        } catch (error) {
            if (error?.response?.status === 409) {
                form.setFieldError('email', 'That email is already registered.');
                return;
            }
            toast.error(errorMessage(error, 'We could not create your account.'));
        }
    });

    return (
        <div className={styles.split}>
            <div className={styles.media}>
                <img
                    src="/images/auth.webp"
                    alt=""
                    width={1200}
                    height={1600}
                    loading="lazy"
                    decoding="async"
                />
                <blockquote className={styles.quote}>
                    <p>“Fewer pieces, chosen better.”</p>
                    <cite>Gabi Fashion Store</cite>
                </blockquote>
            </div>

            <div className={styles.panel}>
                <div className={styles.form}>
                    <header className={styles.head}>
                        <p className="eyebrow">First time here</p>
                        <h1 className={styles.title}>Create account</h1>
                        <p className={styles.sub}>
                            One account for your bag, your orders and early access to new pieces.
                        </p>
                    </header>

                    <form onSubmit={onSubmit} noValidate>
                        <div className={styles.fields}>
                            <Field
                                label="Full name"
                                autoComplete="name"
                                placeholder="Ada Lovelace"
                                {...form.fieldProps('name')}
                            />

                            <Field
                                label="Address"
                                autoComplete="street-address"
                                placeholder="15 Wellington Street, Kitchener"
                                {...form.fieldProps('address')}
                            />

                            <Field
                                label="Phone"
                                type="tel"
                                autoComplete="tel"
                                placeholder="226-899-0000"
                                {...form.fieldProps('phone')}
                            />

                            <Field
                                label="Email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                {...form.fieldProps('email')}
                            />

                            <Field
                                label="Password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="At least 8 characters"
                                hint="Use at least 8 characters."
                                {...form.fieldProps('password')}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn--primary btn--block"
                            disabled={form.submitting}
                        >
                            {form.submitting ? 'Creating account…' : 'Create account'}
                        </button>
                    </form>

                    <p className={styles.alt}>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
