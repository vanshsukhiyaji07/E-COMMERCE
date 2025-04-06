import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Button } from 'react-bootstrap';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../Firebase';
import { useDispatch, useSelector } from 'react-redux';
import addtocart from '../Cart/Action';
import { NavDropdown } from 'react-bootstrap';



function Header() {
    const [userData, setUserData] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const counter = useSelector((state) => state.counter);




    const logout = () => {
        signOut(auth).then(() => {
            setUserData("");
            dispatch(addtocart(0));
            navigate("/login"); // Redirect after logout
        });
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("Logged in:", user);

                setUserData(user.displayName);

                try {
                    const res = await fetch(`http://localhost:3000/cart/?userId=${user.uid}`);
                    const userCart = await res.json();
                    dispatch(addtocart(userCart.length)); // this is good!

                } catch (err) {
                    console.error("Failed to fetch cart:", err);
                }
            } else {
                console.log("User not logged in.");
            }
        });

        // Cleanup listener on unmount
        return () => unsubscribe();

    }, []);

    return (
        <Navbar expand="lg" className="bg-dark navbar-dark py-3 shadow">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-light">
                    🛒 ShopSphere
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" className="text-light fw-semibold">Home</Nav.Link>
                    </Nav>

                    <Form
                        className="d-flex mx-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (searchTerm.trim()) {
                                navigate(`/search/${searchTerm}`);
                                setSearchTerm(""); // Clear the field after navigating
                            }
                        }}
                    >
                        <Form.Control
                            type="search"
                            placeholder="Search for products..."
                            className="me-2 rounded-pill"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-light" className="rounded-pill" type="submit">
                            Search
                        </Button>
                    </Form>



                    <div className="d-flex gap-2">
                        {userData && (
                            <NavDropdown
                                title={`👤 ${userData}`}
                                id="user-nav-dropdown"
                                className="text-light"
                                menuVariant="dark"
                            >
                                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        )}


                        <Link to="/login">
                           
                                {userData ? (
                                    // If logged in, show Logout button
                                    <Button
                                        variant="success"
                                        className="rounded-pill px-4"
                                        onClick={logout}
                                    >
                                        LogOut
                                    </Button>
                                ) : (
                                    // If not logged in, show Login link
                                    <Link to="/login">
                                        <Button variant="success" className="rounded-pill px-4">
                                            LogIn
                                        </Button>
                                    </Link>
                                )}

                           
                        </Link>

                        <Link to="/cartDetails">
                            <Button variant="warning" className="rounded-pill px-4">
                                🛒 Cart{counter > 0 ? `(${counter})` : ""}
                            </Button>
                        </Link>

                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
