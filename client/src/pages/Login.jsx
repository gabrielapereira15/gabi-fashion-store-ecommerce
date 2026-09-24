import { Link, useNavigate } from 'react-router-dom';

import Field from '../components/Field';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { errorMessage } from '../lib/api';
import * as rule from '../lib/validation';
import styles from './Auth.module.css';

const RULES = {
    email: rule.email,
    password: rule.required('Password')
};

export default function Login() {
    const { login } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const form = useForm({ email: '', password: '' }, RULES);

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            const account = await login(values);
            toast.success(`Welcome back, ${account.name.split(' ')[0]}.`);
            navigate('/');
        } catch (error) {
            // A 401 is a credentials problem, so surface it on the form itself.
            if (error?.response?.status === 401) {
                form.setFieldError('password', 'Invalid email or password.');
                return;
            }
            toast.error(errorMessage(error, 'We could not sign you in.'));
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
                        <p className="eyebrow">Welcome back</p>
                        <h1 className={styles.title}>Sign in</h1>
                        <p className={styles.sub}>
                            Sign in to keep your bag and speed up checkout.
                        </p>
                    </header>

                    <form onSubmit={onSubmit} noValidate>
                        <div className={styles.fields}>
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
                                autoComplete="current-password"
                                placeholder="••••••••"
                                {...form.fieldProps('password')}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn--primary btn--block"
                            disabled={form.submitting}
                        >
                            {form.submitting ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>

                    <p className={styles.alt}>
                        Don&apos;t have an account? <Link to="/register">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
