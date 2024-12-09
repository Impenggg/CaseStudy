import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCartItems(response.data);
        } catch (error) {
            setError('Failed to fetch cart items');
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            await axios.put(`http://localhost:8000/api/cart/${itemId}`, {
                quantity
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchCartItems();
        } catch (error) {
            setError('Failed to update quantity');
        }
    };

    const removeItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:8000/api/cart/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchCartItems();
        } catch (error) {
            setError('Failed to remove item');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0).toFixed(2);
    };

    return (
        <Container className="py-4">
            <h2>Shopping Cart</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            {cartItems.length === 0 ? (
                <Alert variant="info">Your cart is empty</Alert>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                                        <Button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                                        <Button onClick={() => removeItem(item.id)}>Remove</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <h4>Total: ${calculateTotal()}</h4>
                        <Button 
                            variant="primary" 
                            size="lg"
                            onClick={() => navigate('/checkout')}
                        >
                            Proceed to Checkout
                        </Button>
                    </div>
                </>
            )}
        </Container>
    );
}

export default Cart; 