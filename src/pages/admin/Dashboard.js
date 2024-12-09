import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Routes, Route, Link } from 'react-router-dom';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';

function Dashboard() {
    return (
        <Container fluid>
            <Row>
                <Col md={2} className="bg-light min-vh-100 p-3">
                    <Nav className="flex-column">
                        <Nav.Link as={Link} to="/admin/products">Products</Nav.Link>
                        <Nav.Link as={Link} to="/admin/orders">Orders</Nav.Link>
                    </Nav>
                </Col>
                <Col md={10} className="p-4">
                    <Routes>
                        <Route path="products" element={<ProductManagement />} />
                        <Route path="orders" element={<OrderManagement />} />
                    </Routes>
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard; 