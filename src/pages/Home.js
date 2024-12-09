import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/products/featured');
            setFeaturedProducts(response.data);
        } catch (error) {
            console.error('Error fetching featured products:', error);
        }
    };

    return (
        <div className="app-container">
            <Container>
                <Row className="justify-content-center py-5">
                    <Col md={8}>
                        <Card className="p-5 text-center">
                            <h1 className="display-4 mb-4">Welcome to Our Shop</h1>
                            <p className="lead mb-4">
                                Discover our curated collection of products designed to meet your needs.
                                Shop with confidence and enjoy our seamless shopping experience.
                            </p>
                            <div className="d-grid gap-3 d-md-flex justify-content-md-center">
                                <Button 
                                    as={Link} 
                                    to="/products" 
                                    variant="primary" 
                                    size="lg"
                                    className="px-5"
                                >
                                    Browse Products
                                </Button>
                                <Button 
                                    as={Link} 
                                    to="/register" 
                                    variant="outline-primary" 
                                    size="lg"
                                    className="px-5"
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row className="py-5">
                    <Col className="text-center mb-4">
                        <h2>Featured Products</h2>
                    </Col>
                </Row>
                <Row className="g-4">
                    {featuredProducts.map(product => (
                        <Col key={product.id} md={4} className="mb-4">
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text>{product.description}</Card.Text>
                                    <Card.Text className="fw-bold">${product.price}</Card.Text>
                                    <Button 
                                        as={Link}
                                        to={`/products`}
                                        variant="outline-primary"
                                    >
                                        View Details
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}

export default Home; 