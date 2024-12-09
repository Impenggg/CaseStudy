import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        barcode: '',
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/products', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProducts(response.data);
        } catch (error) {
            setError('Failed to fetch products');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await axios.put(`http://localhost:8000/api/products/${editId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else {
                await axios.post('http://localhost:8000/api/products', formData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
            setShowModal(false);
            fetchProducts();
            resetForm();
        } catch (error) {
            setError('Failed to save product');
        }
    };

    const handleEdit = (product) => {
        setFormData(product);
        setEditMode(true);
        setEditId(product.id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:8000/api/products/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                fetchProducts();
            } catch (error) {
                setError('Failed to delete product');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            barcode: '',
            name: '',
            description: '',
            price: '',
            quantity: '',
            category: ''
        });
        setEditMode(false);
        setEditId(null);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Product Management</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Add New Product
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Barcode</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.barcode}</td>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.category}</td>
                            <td>
                                <Button 
                                    variant="info" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleEdit(product)}
                                >
                                    Edit
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                resetForm();
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Edit Product' : 'Add New Product'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Form fields */}
                        <Form.Group className="mb-3">
                            <Form.Label>Barcode</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.barcode}
                                onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                                required
                            />
                        </Form.Group>
                        {/* Add other form fields similarly */}
                        <Button variant="primary" type="submit">
                            {editMode ? 'Update' : 'Save'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ProductManagement; 