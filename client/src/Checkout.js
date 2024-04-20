import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Checkout.css';
import CartComponent from './Cart';
import ReactDOM from 'react-dom/client';
import HomePage from './HomePage';
import LoginComponent from './Login';

function CheckoutComponent({ cartItems: propCartItems }) {
    const [cart, setCart] = useState(propCartItems);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 1); 
 
    const goToHome = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<HomePage cartItems={cart} />);
    }

    const goToLogin = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<LoginComponent cartItems={cart} />);
    }

    const goToCart = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<CartComponent cartItems={cart} />);
    }

    const placeOrder = (event) => {
        event.preventDefault();
        const form = event.target.form;
        if (form.checkValidity()) {
            alert("Thank you for the purchase. Hope you enjoy!");
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(<HomePage cartItems={[]} />);
        } else {
            alert("Please fill in all required fields.");
        }
    }

    return (
        <div className="homepage">
            <nav className="navbar">
                <div className="logo"><h1>Gabi Fashion Store</h1></div>
                <ul className="menu">
                    <li><a onClick={() => goToHome()}>Home</a></li>
                    <li><a onClick={() => goToLogin()}>Login</a></li>
                    <li><a onClick={() => goToCart()}>Cart {cart.length > 0 && <span className="cart-count">{cart.length}</span>}</a></li>
                </ul>
                <div className="menu-btn">
                    <i className="fa fa-bars"></i>
                </div>
            </nav>

            <section className="checkout-section">
                <h2>Checkout</h2>
                <form className="checkout-form">
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <input type="text" id="address" name="address" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone:</label>
                        <input type="tel" id="phone" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="creditCard">Credit Card Number:</label>
                        <input type="text" id="creditCard" name="creditCard" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="expiration">Expiration Date:</label>
                        <input type="text" id="expiration" name="expiration" placeholder="MM/YYYY" required />
                    </div>
                    <div className="form-group">
                        <button type="submit" onClick={(event) => placeOrder(event)}>Place Order</button>
                    </div>
                </form>

                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <ul>
                        {propCartItems.map((item, index) => (
                            <li key={index}>
                                <span>{item.productName}</span>
                                <span>Quantity: {item.quantity}</span>
                                <span>${item.quantity * item.value}</span>
                            </li>
                        ))}
                    </ul>
                    <h4>Delivery Info</h4>
                    <span>{deliveryDate.toLocaleDateString()}</span>
                    <p>Total: ${propCartItems.reduce((total, item) => total + (item.quantity * item.value), 0)}</p>
                </div>
            </section>

            <footer>
                <p>15 Wellington Street Kitchener, CA - (226)899-XXXX</p>
                <p className="copyright-text">© Gabriela Nascimento Oliveira Pereira</p>
            </footer>
        </div>
    );
}

export default CheckoutComponent;
