import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { auth } from "../../Firebase";
import { ToastContainer, toast } from 'react-toastify';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


function SignUp() {
    let [userData, setuserData] = useState({});
    const navigate = useNavigate();


    let getinput = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setuserData({ ...userData, [name]: value });
    }

    let submit = async (e) => {
        e.preventDefault();

        if (userData.password === userData.cpassword) {
            try {
                const res = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
                await updateProfile(auth.currentUser, {
                    displayName: userData.name
                });

                toast.success("Account created successfully!");
                setTimeout(() => {
                    navigate('/'); // 👈 Redirect to Home after signup
                }, 1500);
            } catch (err) {
                toast.error(err.message);
            }
        } else {
            toast.error("Passwords do not match.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Row className="w-100">
                <Col md={6} lg={4} className="mx-auto">
                    <Card className="shadow-lg p-4 rounded">
                        <Card.Body>
                            <h2 className="text-center fw-bold mb-4">📝 Sign Up</h2>
                            <Form method="post" onSubmit={(e) => submit(e)}>
                                <Form.Group className="mb-3">
                                    <Form.Label><FaEnvelope className="me-2" />userName</Form.Label>
                                    <Form.Control type="text" placeholder="Enter your userName" className="py-2" name="name" onChange={(e) => getinput(e)} />
                                </Form.Group>
                                {/* Email Field */}
                                <Form.Group className="mb-3">
                                    <Form.Label><FaEnvelope className="me-2" />Email Address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter your email" className="py-2" name="email" onChange={(e) => getinput(e)} />
                                </Form.Group>

                                {/* Password Field */}
                                <Form.Group className="mb-3">
                                    <Form.Label><FaLock className="me-2" />Password</Form.Label>
                                    <Form.Control type="password" placeholder="Enter password" className="py-2" name="password" onChange={(e) => getinput(e)} />
                                </Form.Group>

                                {/* Confirm Password Field */}
                                <Form.Group className="mb-3">
                                    <Form.Label><FaLock className="me-2" />Confirm Password</Form.Label>
                                    <Form.Control type="password" placeholder="Confirm password" className="py-2" name="cpassword" onChange={(e) => getinput(e)} />
                                </Form.Group>

                                {/* Sign-Up Button */}
                                <Button variant="primary" className="w-100 py-2" type="submit">
                                    Sign Up
                                </Button>

                            </Form>

                            {/* Already have an account? */}
                            <div className="text-center mt-3">
                                <span className="text-muted">Already have an account? </span>
                                <Link to="/login" className="text-decoration-none fw-bold">Log In</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <ToastContainer />
        </Container>
    );
}

export default SignUp;
