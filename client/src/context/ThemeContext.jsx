import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'gfs.theme.v1';
const ThemeContext = createContext(null);

/** 'system' follows the OS; 'light' and 'dark' pin the choice. */
function loadPreference() {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return saved === 'light' || saved === 'dark' ? saved : 'system';
    } catch {
        return 'system';
    }
}

const systemPrefersDark = () =>
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

export function ThemeProvider({ children }) {
    const [preference, setPreference] = useState(loadPreference);
    const [systemDark, setSystemDark] = useState(systemPrefersDark);

    // Follow the OS while the preference is 'system'.
    useEffect(() => {
        const query = window.matchMedia?.('(prefers-color-scheme: dark)');
        if (!query) return undefined;

        const onChange = (event) => setSystemDark(event.matches);
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }, []);

    const resolved = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

    useEffect(() => {
        const root = document.documentElement;

        // No attribute means "follow the media query", which is what the
        // tokens already do — so 'system' leaves the DOM untouched.
        if (preference === 'system') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', preference);
        }

        try {
            if (preference === 'system') window.localStorage.removeItem(STORAGE_KEY);
            else window.localStorage.setItem(STORAGE_KEY, preference);
        } catch {
            // Storage unavailable — the choice still applies for this session.
        }
    }, [preference]);

    const toggle = useCallback(() => {
        setPreference(resolved === 'dark' ? 'light' : 'dark');
    }, [resolved]);

    const value = useMemo(
        () => ({ preference, resolved, toggle, setPreference }),
        [preference, resolved, toggle]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used inside a <ThemeProvider>');
    }
    return context;
}
