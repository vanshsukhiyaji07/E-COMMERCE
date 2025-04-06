import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
    const [category, setCategory] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [selectedCategory]); // Fetch data whenever category changes

    const fetchProducts = async () => {
        let url = selectedCategory  
            ? `https://fakestoreapi.com/products/category/${selectedCategory}`
            : "https://fakestoreapi.com/products";
        
        try {
            let response = await fetch(url);
            let data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            let response = await fetch("https://fakestoreapi.com/products/categories");
            let data = await response.json();
            setCategory(data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    return (
        <Container className="py-4">
            {/* Category Filter Section */}
            <Row className="justify-content-center mb-4">
                <Col md="auto">
                    <Button 
                        variant={selectedCategory ? "outline-primary" : "primary"} 
                        className="m-2 rounded-pill px-4"
                        onClick={() => setSelectedCategory("")}
                    >
                        All
                    </Button>
                    {category.map((item, index) => (
                        <Button 
                            key={index} 
                            variant={selectedCategory === item ? "primary" : "outline-primary"} 
                            className="m-2 rounded-pill px-4"
                            onClick={() => setSelectedCategory(item)}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </Button>
                    ))}
                </Col>
            </Row>

            {/* Product Listing */}
            <Row className="g-4">
                {products.map((item) => (
                    <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                        <Card className="shadow-lg border-0 rounded-3">
                            <Card.Img 
                                variant="top" 
                                src={item.image} 
                                style={{ height: "250px", objectFit: "contain", padding: "10px" }}
                            />
                            <Card.Body className="text-center">
                                <Card.Title className="fw-bold text-truncate">{item.title}</Card.Title>
                                <Card.Text className="text-muted small" style={{ height: "50px", overflow: "hidden" }}>
                                    {item.description.substring(0, 80)}...
                                </Card.Text>
                                <h5 className="fw-semibold text-success">₹ {Math.ceil(item.price * 87)}</h5>
                                <Link to={`/product/${item.id}`}>
                                    <Button variant="dark" className="mt-2 w-100 rounded-pill">View Product</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Home;
