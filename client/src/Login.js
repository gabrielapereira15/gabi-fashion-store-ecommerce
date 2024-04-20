import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import CartComponent from './Cart';
import ReactDOM from 'react-dom/client';
import HomePage from './HomePage';

function LoginComponent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const goToHome = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<HomePage />);
    }

    const goToCart = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<CartComponent />);
    }

    const handleLogin = () => {
        console.log("Username:", username);
        console.log("Password:", password);
        alert("Welcome " + {username});
    };
        
    return (
        <div className="homepage">
            <nav className="navbar">
                <div className="logo"><h1>Gabi Fashion Store</h1></div>
                <ul className="menu">
                    <li><a onClick={() => goToHome()}>Home</a></li>
                    <li><a className="active">Login</a></li>
                    <li><a onClick={() => goToCart()}>Cart</a></li>
                </ul>
                <div className="menu-btn">
                    <i className="fa fa-bars"></i>
                </div>
            </nav>

            <section className="content">
                <div className="mainContainer">
                    <form onSubmit={handleLogin}>
                        <h1>Login</h1><br/>
                        <div className="inputContainer">
                            <input 
                                type="text" 
                                placeholder="Enter Username"
                                id="username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required
                            />
                        </div> <br/>
                        <div className="inputContainer">
                            <input 
                                type="password"
                                placeholder="Enter Password" 
                                id="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit">Login</button> 
                    </form>
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
