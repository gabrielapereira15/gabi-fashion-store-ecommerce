import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import LoginComponent from './Login'
import ReactDOM from 'react-dom/client';
import HomePage from './HomePage';

function CartComponent() {
    const [backendPhrase, setBackendPhrase] = useState('');

    useEffect(() => {
      axios.get('http://localhost:8080')
        .then(response => {
          console.log(response.data)
          setBackendPhrase(response.data);
        })
        .catch(error => {
          setBackendPhrase("oh it's not working, baby")
        });
    }, []);;

    const goToHome = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<HomePage />);
    }

    const goToLogin = () => {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<LoginComponent />);
    }
        
    return (
        <div class="homepage">
                <nav class="navbar">
                    <div class="logo"><h1>Gabi Fashion Store</h1></div>
                    <ul class="menu">
                        <li><a onClick={() => goToHome()}>Home</a></li>
                        <li><a onClick={() => goToLogin()}>Login</a></li>
                        <li><a class="active">Cart</a></li>
                    </ul>
                    <div class="menu-btn">
                        <i class="fa fa-bars"></i>
                    </div>
                </nav>

                <footer>
                <p>15 Wellignton Street Kitchener, CA - (226)899-XXXX</p>
                <p class="copyright-text">© Gabriela Nascimento Oliveira Pereira</p>
                </footer>
        </div>
    );
}

export default CartComponent;
