import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Registration.css';
import CartComponent from './Cart';
import ReactDOM from 'react-dom/client';
import HomePage from './HomePage';
import LoginComponent from './Login';

function RegistrationComponent({ cartItems: propCartItems }) {
    const [cart, setCart] = useState(propCartItems);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const goToHome = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<HomePage cartItems={cart} />);
    }

    const goToCart = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<CartComponent cartItems={cart} />);
    }

    const goToLogin = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<LoginComponent cartItems={cart} />);
    }

    const handleRegistration = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        console.log("Name:", name);
        console.log("Address:", address);
        console.log("Phone:", phone);
        console.log("Email:", email);
        console.log("Password:", password);
        alert("Welcome to our fashion store");
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<HomePage cartItems={cart} />);
    };

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

            <section>
                <div class="main-container">
                    <div class="form-container">
                        <div class="form-body">
                            <h2 class="title">Registration</h2>

                            <form onSubmit={handleRegistration} className="the-form">

                                <input type="text" id="name" name="name" placeholder="Enter your name" required />

                                <input type="text" id="address" name="address" placeholder="Enter your address" required />

                                <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required />

                                <input type="email" name="email" id="email" placeholder="Enter your email"/>

                                <input type="password" name="password" id="password" placeholder="Create a password"/>

                                <input type="submit" value="Sign Up"/>

                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <footer>
                <p>15 Wellington Street Kitchener, CA - (226)899-XXXX</p>
                <p className="copyright-text">© Gabriela Nascimento Oliveira Pereira</p>
            </footer>
        </div>
    );
}

export default RegistrationComponent;
