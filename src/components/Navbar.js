import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = () => {
        logout();
        closeMenu();
    };

    return (
        <header className="main-header">
            <div className="container top-bar">
                <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none' }}>
                    <h1 > Pilot Simulation </h1>
                </Link>

                {/* The Hamburger Icon */}
                <div className={`hamburger ${isMenuOpen ? "toggle" : ""}`} onClick={toggleMenu}>
                    <div className="line1"></div>
                    <div className="line2"></div>
                    <div className="line3"></div>
                </div>

                {/* Top-Down Menu */}
                <nav className={`nav-dropdown ${isMenuOpen ? "active" : ""}`}>
                    <div className="nav-links">
                        {user ? (
                            <>
                                <Link to="/home" onClick={closeMenu}>
                                    <button className="btn">Home</button>
                                </Link>
                                <Link to="/form" onClick={closeMenu}>
                                    <button className="btn">Form</button>
                                </Link>
                                <Link to="/history" onClick={closeMenu}>
                                    <button className="btn">History</button>
                                </Link>
                                <button className="btn btm logout-btn" onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={closeMenu}>
                                    <button className="btn">Login</button>
                                </Link>
                                <Link to="/signup" onClick={closeMenu}>
                                    <button className="btn">Sign Up</button>
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
            
            <div className="cc">
                <h1>AEROCLUB NITTE</h1>
                <p>We not only navigate skies, we also navigate dreams</p>
            </div>
        </header>
    );
};

export default Navbar;