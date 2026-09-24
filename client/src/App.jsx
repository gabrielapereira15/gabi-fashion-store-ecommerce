import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './components/Layout';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

/**
 * Real routes, so the back button, deep links and refresh all work.
 * The previous build re-rendered a fresh React root on every navigation.
 */
const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/cart', element: <Cart /> },
            { path: '/checkout', element: <Checkout /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            { path: '/admin', element: <Admin /> },
            { path: '*', element: <NotFound /> }
        ]
    }
]);

export default function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <CartProvider>
                        <RouterProvider router={router} />
                    </CartProvider>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}
