import { useCallback, useState } from 'react';
import { validate } from '../lib/validation';

/**
 * Minimal controlled-form hook.
 *
 * Fields validate on blur and on submit — not on every keystroke, which would
 * flag an email as invalid while it is still being typed.
 */
export function useForm(initialValues, rules) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = useCallback(
        (event) => {
            const { name, value } = event.target;
            setValues((current) => ({ ...current, [name]: value }));

            // Once a field has shown an error, re-check as they fix it.
            if (errors[name]) {
                const rule = rules[name];
                const error = rule ? rule(value, values) : null;
                setErrors((current) => ({ ...current, [name]: error || undefined }));
            }
        },
        [errors, rules, values]
    );

    const handleBlur = useCallback(
        (event) => {
            const { name, value } = event.target;
            setTouched((current) => ({ ...current, [name]: true }));

            const rule = rules[name];
            if (!rule) return;

            const error = rule(value, values);
            setErrors((current) => ({ ...current, [name]: error || undefined }));
        },
        [rules, values]
    );

    /** Props to spread onto a <Field>. */
    const fieldProps = useCallback(
        (name) => ({
            name,
            value: values[name] ?? '',
            onChange: handleChange,
            onBlur: handleBlur,
            error: touched[name] ? errors[name] : undefined
        }),
        [values, handleChange, handleBlur, touched, errors]
    );

    /** Wraps a submit handler with validation and a submitting flag. */
    const handleSubmit = useCallback(
        (onValid) => async (event) => {
            event.preventDefault();

            const result = validate(values, rules);
            setErrors(result.errors);
            setTouched(Object.fromEntries(Object.keys(rules).map((key) => [key, true])));

            if (!result.isValid) {
                // Move focus to the first problem so keyboard users are not lost.
                const firstField = Object.keys(rules).find((key) => result.errors[key]);
                event.target
                    .querySelector(`[name="${firstField}"]`)
                    ?.focus({ preventScroll: false });
                return;
            }

            setSubmitting(true);
            try {
                await onValid(values);
            } finally {
                setSubmitting(false);
            }
        },
        [values, rules]
    );

    const setFieldError = useCallback((name, message) => {
        setErrors((current) => ({ ...current, [name]: message }));
        setTouched((current) => ({ ...current, [name]: true }));
    }, []);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        submitting,
        setValues,
        fieldProps,
        handleSubmit,
        setFieldError,
        reset
    };
}
