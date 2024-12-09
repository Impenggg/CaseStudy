import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addToCart = async (productId) => {
        try {
            await axios.post('http://localhost:8000/api/cart', {
                product_id: productId,
                quantity: 1
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Show success message
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col>
                    <Form.Control
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {/* Add categories dynamically */}
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                {products.map(product => (
                    <Col key={product.id} md={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>{product.description}</Card.Text>
                                <Card.Text>Price: ${product.price}</Card.Text>
                                <Button 
                                    variant="primary"
                                    onClick={() => addToCart(product.id)}
                                >
                                    Add to Cart
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default ProductList; 