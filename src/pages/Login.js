import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        
        try {
            const response = await axios.post('http://localhost:8000/api/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            if (response.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/products');
            }
        } catch (err) {
            if (err.response) {
                // Handle specific error cases
                switch (err.response.status) {
                    case 401:
                        setError('Invalid email or password');
                        break;
                    case 422:
                        setError('Please check your input and try again');
                        break;
                    case 429:
                        setError('Too many login attempts. Please try again later');
                        break;
                    default:
                        setError('Login failed. Please try again');
                }
            } else if (err.request) {
                setError('Network error. Please check your connection');
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={6}>
                    <h2>Login</h2>
                    {error && (
                        <Alert variant="danger" dismissible onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login; 