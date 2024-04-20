import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';
import LoginComponent from './Login'
import CheckoutComponent from './Checkout'
import ReactDOM from 'react-dom/client';
import HomePage from './HomePage';

function CartComponent({ cartItems: propCartItems }) {
    const [cartItems, setCartItems] = useState(propCartItems);

    const removeFromCart = (index) => {
        const updatedCart = [...cartItems];
        updatedCart.splice(index, 1);
        setCartItems(updatedCart);
    };

    const handleQuantityChange = (index, quantity) => {
        const updatedCart = [...cartItems];
        updatedCart[index].quantity = quantity;
        setCartItems(updatedCart);
    };

    const goToHome = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<HomePage cartItems={cartItems}/>);
    }

    const goToLogin = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<LoginComponent cartItems={cartItems}/>);
    }

    const goToCheckout = () => {
        if (cartItems.length > 0) {
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(<CheckoutComponent cartItems={cartItems}/>);
        } else {
            alert("Your cart is empty. Please add items before proceeding to checkout.");
        }

    }
    return (
        <div class="homepage">
                <nav class="navbar">
                    <div class="logo"><h1>Gabi Fashion Store</h1></div>
                    <ul class="menu">
                        <li><a onClick={() => goToHome()}>Home</a></li>
                        <li><a onClick={() => goToLogin()}>Login</a></li>
                        <li><a class="active">Cart {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}</a></li>
                    </ul>
                    <div class="menu-btn">
                        <i class="fa fa-bars"></i>
                    </div>
                </nav>

                <div className="cart-background">
                    <section className="shopping-cart">
                        <h1>Your Shopping Cart</h1>
                        <ul>
                            {cartItems.map((item, index) => (
                                <li key={index} className="cart-item">
                                    <p>{item.productName} - Color: {item.productColor}</p>
                                    <div className="quantity-input">
                                        <label htmlFor={`quantity-${index}`}>Qnt:</label>
                                        <input
                                            id={`quantity-${index}`}
                                            type="number"
                                            value={item.quantity || 1}
                                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                            min="1"
                                        />
                                    </div>
                                    <button onClick={() => removeFromCart(index)}>Remove</button>
                                    <span> ${item.quantity * item.value}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="cart-total">
                            <span>Total: ${cartItems.reduce((total, item) => total + (item.quantity * item.value), 0)}</span>
                            <button onClick={() => goToCheckout()}>Checkout</button>
                        </div>
                    </section>
                </div>

                <footer>
                <p>15 Wellignton Street Kitchener, CA - (226)899-XXXX</p>
                <p class="copyright-text">© Gabriela Nascimento Oliveira Pereira</p>
                </footer>
        </div>
    );
}

export default CartComponent;
