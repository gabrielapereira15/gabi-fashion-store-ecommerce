import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './HomePage.css';
import CartComponent from './Cart';
import LoginComponent from './Login'

function HomePage() {
    // Setting state
    const [productList, setProductList] = useState([]);

    // Get product list from the backend
    useEffect(() => {
        axios.get('http://localhost:8080/products')
            .then(response => {
                setProductList(response.data);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
            });
    }, []);

    // Render methods to navigate to the other pages
    const goToCart = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<CartComponent />);
    }

    const goToLogin = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<LoginComponent />);
    }

    return (
        <div className="homepage">
            {/* Navigation */}
            <nav className="navbar">
                {/* Logo */}
                <div className="logo"><h1>Gabi Fashion Store</h1></div>
                {/* Menu */}
                <ul className="menu">
                    <li><a href="" className="active">Home</a></li>
                    <li><a onClick={() => goToLogin()}>Login</a></li>
                    <li><a onClick={() => goToCart()}>Cart</a></li>
                </ul>
                {/* Menu Button */}
                <div className="menu-btn">
                    <i className="fa fa-bars"></i>
                </div>
            </nav>

            {/* Main Content */}
            <section className="content">
                <h1>Where fashion meets elegance!</h1>
                <p>Unleash your style potential. Take a look at our products today.</p>
            </section>

            {/* Product Section */}
            <h1 className="pheading">Our Products</h1>
            <section className="sec">
                <div className="products">
                    {/* Map through productList and render a card for each product */}
                    {productList.map(product => (
                        <div key={product._id} className="card">
                            <div className="img"><img src={`/images/${product.productId.toLowerCase().replace(/\s/g, '')}.jpg`} alt={product.productName} /></div>
                            <div className="desc">{product.productType ?? "Product Type Unavailable"}</div>
                            <div className="title">{product.productName ?? "Product Name Unavailable"}</div>
                            <div className="box">
                                <div className="price">$ {product.value ?? "Price Unavailable"}</div>
                                <button className="btn">Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer>
                <p>15 Wellington Street Kitchener, CA - (226) 899-XXXX</p>
                <p className="copyright-text">© Gabriela Nascimento Oliveira Pereira</p>
            </footer>
        </div>
    );
}

export default HomePage;
