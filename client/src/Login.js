import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import CartComponent from './Cart';
import ReactDOM from 'react-dom/client';
import HomePage from './HomePage';
import RegistrationComponent from './Registration';

function LoginComponent({ cartItems: propCartItems }) {
    const [cart, setCart] = useState(propCartItems);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const goToHome = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<HomePage cartItems={cart} />);
    }

    const goToCart = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<CartComponent cartItems={cart} />);
    }

    const goToRegistration = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<RegistrationComponent cartItems={cart} />);
    }

    const validateLoginForm = () => {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (emailInput.validity.valid && passwordInput.validity.valid) {
            setUsername(emailInput.value);
            setPassword(passwordInput.value);
            alert("Welcome to our fashion store");
        } else {
            alert('Please fill in all required fields.');
        }
    };

        
    return (
        <div className="homepage">
            <nav className="navbar">
                <div className="logo"><h1>Gabi Fashion Store</h1></div>
                <ul className="menu">
                    <li><a onClick={() => goToHome()}>Home</a></li>
                    <li><a className="active">Login</a></li>
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
                            <h2 class="title">Login</h2>

                            <form action="" class="the-form">

                                <input type="email" name="email" id="email" placeholder="Enter your email" required/>

                                <input type="password" name="password" id="password" placeholder="Enter your password" required/>

                                <input type="submit" value="Log In" onClick={validateLoginForm}/>

                            </form>
                            <br/><span>Don't have an account?</span> <a onClick={() => goToRegistration()}>Sign Up</a>

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

export default LoginComponent;
