import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <BootstrapNavbar bg="light" expand="lg">
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/">Shop</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle />
                <BootstrapNavbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/products">Products</Nav.Link>
                    </Nav>
                    <Nav>
                        {token ? (
                            <>
                                <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
}

export default Navbar; 