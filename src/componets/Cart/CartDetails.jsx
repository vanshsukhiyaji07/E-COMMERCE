import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../Firebase';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import addtocart from '../Cart/Action';


function CartDetails() {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [showSummary, setShowSummary] = useState(false); // 👈 track if we show order summary
    const [showConfirmation, setShowConfirmation] = useState(false);
    const dispatch = useDispatch();



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                fetchCart(user.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchCart = async (uid) => {
        try {
            const res = await fetch(`http://localhost:3000/cart/?userId=${uid}`);
            const data = await res.json();
            setCartItems(data);
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
        }
    };

    const handleRemove = async (itemId) => {
        try {
            await fetch(`http://localhost:3000/cart/${itemId}`, {
                method: 'DELETE',
            });
    
            setCartItems(prev => {
                const updated = prev.filter(item => item.id !== itemId);
                dispatch(addtocart(updated.length)); // 👈 update Redux cart count
                return updated;
            });
    
            toast.success('Item removed from cart.');
        } catch (error) {
            console.error('Failed to remove item:', error);
            toast.error('Failed to remove item.');
        }
    };
    
    const handleBuyNow = (item) => {
        setSelectedItem(item);
        setShowModal(true);
        setShowSummary(false);
        setPaymentMethod('');
    };

    const handlePayment = () => {
        if (!paymentMethod) {
            toast.error("Please select a payment method.");
            return;
        }
        // Show order summary first
        setShowSummary(true);
    };

    const handleConfirmOrder = () => {
        toast.success(`Order placed successfully using ${paymentMethod}`);
        setCartItems(prev => {
            const updated = prev.filter(item => item.id !== selectedItem.id);
            dispatch(addtocart(updated.length)); // 👈 update count
            return updated;
        });
    
        setShowModal(false);
        setPaymentMethod('');
        setShowSummary(false);
        setSelectedItem(null);
        setShowConfirmation(true);
    };
    



    if (!userId) return <h3 className="text-center py-5">Please log in to view your cart.</h3>;

    return (
        <Container className="py-5">
            <h2 className="mb-4">🛒 Your Cart</h2>
            {cartItems.length === 0 ? (
                <h4 className="text-center text-muted">Your cart is empty.</h4>
            ) : (
                <Row>
                    {cartItems.map((item) => (
                        <Col md={4} key={item.id} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Img
                                    variant="top"
                                    src={item.image}
                                    style={{ height: '250px', objectFit: 'contain' }}
                                />
                                <Card.Body>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>Price: ₹{item.price}</Card.Text>
                                    <Card.Text>Quantity: {item.quantity}</Card.Text>

                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="danger"
                                            className="rounded-pill w-50"
                                            onClick={() => handleRemove(item.id)}
                                        >
                                            Remove
                                        </Button>
                                        <Button
                                            variant="success"
                                            className="rounded-pill w-50"
                                            onClick={() => handleBuyNow(item)}
                                        >
                                            Buy Now
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Modal for Payment & Order Summary */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {showSummary ? 'Order Summary' : 'Complete Your Purchase'}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
  {selectedItem && (
    <>
      <h5>{selectedItem.title}</h5>
      <p>Price per item: ₹{selectedItem.price}</p>
      <p>Quantity: {selectedItem.quantity}</p>
      <p className="fw-bold">Total Price: ₹{selectedItem.price * selectedItem.quantity}</p>

      {!showSummary ? (
        <>
          <Form.Group>
            <Form.Label>Select Payment Method</Form.Label>
            <Form.Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">-- Choose --</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </Form.Select>
          </Form.Group>

          {paymentMethod === 'UPI' && (
            <div className="text-center mt-3">
              <p className="fw-semibold">Scan QR to Pay</p>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=shop@example.com&pn=ShopSphere"
                alt="UPI QR Code"
              />
              <p className="text-muted small mt-2">UPI ID: shop@example.com</p>
            </div>
          )}

          {paymentMethod === 'Credit Card' && (
            <Form.Group className="mt-3">
              <Form.Label>Enter Credit Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                maxLength={19}
              />
            </Form.Group>
          )}
        </>
      ) : (
        <div className="mt-3">
          <Form.Group>
            <Form.Label>Selected Payment Method</Form.Label>
            <Form.Control
              type="text"
              readOnly
              value={paymentMethod}
              className="fw-bold"
            />
          </Form.Group>
        </div>
      )}
    </>
  )}
</Modal.Body>



                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>

                    {!showSummary ? (
                        <Button variant="primary" onClick={handlePayment}>
                            Pay Now
                        </Button>
                    ) : (
                        <Button variant="success" onClick={handleConfirmOrder}>
                            Confirm Order
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
            <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Order Confirmed ✅</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <h5>🎉 Thank you for your purchase!</h5>
                    <p>Your order has been successfully placed using <strong>{paymentMethod}</strong>.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowConfirmation(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
}

export default CartDetails;
