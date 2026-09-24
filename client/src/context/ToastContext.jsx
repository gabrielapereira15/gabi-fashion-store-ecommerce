import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import ToastStack from '../components/ToastStack';

const ToastContext = createContext(null);
const DEFAULT_DURATION = 3500;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef(new Map());
    const nextId = useRef(0);

    const dismiss = useCallback((id) => {
        const timer = timers.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timers.current.delete(id);
        }
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const push = useCallback(
        (message, { variant = 'info', duration = DEFAULT_DURATION } = {}) => {
            const id = nextId.current++;

            setToasts((current) => [...current, { id, message, variant }]);
            timers.current.set(
                id,
                setTimeout(() => dismiss(id), duration)
            );

            return id;
        },
        [dismiss]
    );

    const value = useMemo(
        () => ({
            toast: push,
            success: (message, options) => push(message, { ...options, variant: 'success' }),
            error: (message, options) => push(message, { ...options, variant: 'error' }),
            dismiss
        }),
        [push, dismiss]
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastStack toasts={toasts} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used inside a <ToastProvider>');
    }
    return context;
}
