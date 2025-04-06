import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../Firebase';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import addtocart from '../Cart/Action';

function Product() {
    const { id } = useParams();
    const [singleProduct, setSingleProduct] = useState(null);
    const [userData, setUserData] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserData(user);
            } else {
                setUserData(null);
            }
        });
    }, []);

    const AddToCart = async (e) => {
        e.preventDefault();
        if (!userData) {
            toast.error("Please log in to add to cart.");
            navigate("/login");
            return;
        }

        const cart = {
            userId: userData.uid,
            ProductId: id,
            quantity,
            title: singleProduct.title,
            image: singleProduct.image,
            price: Math.ceil(singleProduct.price * 88)
        };

        try {
            const checkRes = await fetch(`http://localhost:3000/cart/?userId=${userData.uid}&ProductId=${id}`);
            const existData = await checkRes.json();

            if (existData.length > 0) {
                toast.info("Product already exists in cart.");
                return;
            }

            await fetch("http://localhost:3000/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cart)
            });

            const newCartRes = await fetch(`http://localhost:3000/cart/?userId=${userData.uid}`);
            const newCart = await newCartRes.json();
            dispatch(addtocart(newCart.length));
            toast.success("Product added to cart!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to add to cart.");
        }
    };

    useEffect(() => {
        const getOneProduct = async () => {
            try {
                const response = await fetch(`https://fakestoreapi.com/products/${id}`);
                const data = await response.json();
                setSingleProduct(data);

                // fetch related products
                const relatedRes = await fetch(`https://fakestoreapi.com/products/category/${data.category}`);
                const related = await relatedRes.json();

                // filter out the current product from related list
                const filtered = related.filter(item => item.id !== parseInt(id));
                setRelatedProducts(filtered);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };


        getOneProduct();
    }, [id]);

    if (!singleProduct) return <h2 className="text-center py-5">Loading...</h2>;

    return (
        <Container className="py-5">
            <Row className="align-items-center">
                <Col md={6} className="text-center">
                    <img
                        src={singleProduct.image}
                        alt={singleProduct.title}
                        className="img-fluid shadow-lg rounded"
                        style={{ maxWidth: "80%", height: "400px", objectFit: "contain" }}
                    />
                </Col>
                <Col md={6}>
                    <h2 className="fw-bold">{singleProduct.title}</h2>
                    <h5 className="my-2 text-warning">
                        {[...Array(Math.ceil(singleProduct.rating?.rate))].map((_, i) => (
                            <span key={i}>&#9733;</span>
                        ))}
                    </h5>
                    <h6 className="text-muted">Rating: {singleProduct.rating?.rate} / 5</h6>
                    <hr />
                    <h3 className="fw-bold text-danger">₹{Math.ceil(singleProduct.price * 88)}</h3>
                    <p className="text-muted">{singleProduct.description}</p>
                    <hr />
                    <Form.Select
                        className="mb-3"
                        name="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                        {[...Array(10)].map((_, i) => (
                            <option key={i} value={i + 1}>{i + 1}</option>
                        ))}
                    </Form.Select>

                    <div className="d-flex gap-3">
                        <Button
                            variant="warning"
                            className="rounded-pill px-4"
                            onClick={AddToCart}
                        >
                            🛒 Add to Cart
                        </Button>

                    </div>
                </Col>
            </Row>
            <hr className="my-5" />
            <h3 className="mb-4">🛍️ You might also like</h3>
            <Row>
                {relatedProducts.map((product) => (
                    <Col md={3} sm={6} xs={12} key={product.id} className="mb-4">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={product.image}
                                className="card-img-top p-3"
                                style={{ height: '200px', objectFit: 'contain' }}
                                alt={product.title}
                            />
                            <div className="card-body d-flex flex-column justify-content-between">
                                <h6 className="card-title">{product.title.slice(0, 40)}...</h6>
                                <p className="text-danger fw-bold">₹{Math.ceil(product.price * 88)}</p>
                                <Button
                                    variant="primary"
                                    as="a"
                                    href={`/product/${product.id}`}
                                    className="rounded-pill w-100 mt-auto"
                                >
                                    View Product
                                </Button>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>

        </Container>
    );
}

export default Product;
