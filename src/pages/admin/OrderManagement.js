import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/orders', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await axios.put(`http://localhost:8000/api/orders/${orderId}/status`, 
                { status },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            fetchOrders();
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    const handleShowDetails = (order) => {
        setSelectedOrder(order);
        setShowDetails(true);
    };

    return (
        <div>
            <h2 className="mb-4">Order Management</h2>
            
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{order.user.name}</td>
                            <td>${order.total_amount}</td>
                            <td>
                                <Badge bg={
                                    order.status === 'pending' ? 'warning' :
                                    order.status === 'processing' ? 'info' :
                                    order.status === 'completed' ? 'success' : 'danger'
                                }>
                                    {order.status}
                                </Badge>
                            </td>
                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                            <td>
                                <Button 
                                    variant="info" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleShowDetails(order)}
                                >
                                    View Details
                                </Button>
                                <Button 
                                    variant="success" 
                                    size="sm"
                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                    disabled={order.status === 'completed'}
                                >
                                    Mark Completed
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Order Details #{selectedOrder?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <div>
                            <h5>Customer Information</h5>
                            <p>Name: {selectedOrder.user.name}</p>
                            <p>Email: {selectedOrder.user.email}</p>
                            
                            <h5 className="mt-4">Order Items</h5>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.product.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>${item.price}</td>
                                            <td>${item.quantity * item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            
                            <div className="text-end mt-3">
                                <h5>Total: ${selectedOrder.total_amount}</h5>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default OrderManagement; 