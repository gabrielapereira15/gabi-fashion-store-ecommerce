import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/** Shell shared by every route: skip link, nav, page outlet, footer. */
export default function Layout() {
    return (
        <>
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <Navbar />
            <main id="main">
                <Outlet />
            </main>
            <Footer />
            <ScrollRestoration />
        </>
    );
}
