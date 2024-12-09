import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Checkout() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        shipping_address: '',
        city: '',
        postal_code: '',
        payment_method: 'cash_on_delivery'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:8000/api/orders', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate('/orders');
        } catch (error) {
            setError('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4">
            <h2>Checkout</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Shipping Address</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={formData.shipping_address}
                        onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.postal_code}
                        onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Select
                        value={formData.payment_method}
                        onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                    >
                        <option value="cash_on_delivery">Cash on Delivery</option>
                        <option value="credit_card">Credit Card</option>
                    </Form.Select>
                </Form.Group>

                <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Place Order'}
                </Button>
            </Form>
        </Container>
    );
}

export default Checkout; 