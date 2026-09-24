import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../lib/api';

const STORAGE_KEY = 'gfs.user.v1';

const AuthContext = createContext(null);

function loadUser() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(loadUser);

    useEffect(() => {
        try {
            if (user) {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            } else {
                window.localStorage.removeItem(STORAGE_KEY);
            }
        } catch {
            // Storage unavailable — the session still works in memory.
        }
    }, [user]);

    const login = useCallback(async (credentials) => {
        const account = await authApi.login(credentials);
        setUser(account);
        return account;
    }, []);

    const register = useCallback(async (payload) => {
        const account = await authApi.register(payload);
        setUser(account);
        return account;
    }, []);

    const logout = useCallback(() => setUser(null), []);

    const value = useMemo(
        () => ({ user, isAuthenticated: Boolean(user), login, register, logout }),
        [user, login, register, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside an <AuthProvider>');
    }
    return context;
}
