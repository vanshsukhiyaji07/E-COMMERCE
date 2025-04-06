import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

function SearchResults() {
  const { query } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();

        const filtered = data.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        );

        setResults(filtered);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <Container className="py-5">
      <h2 className="mb-4">🔍 Search Results for: "{query}"</h2>
      <Row>
        {results.length > 0 ? (
          results.map((product) => (
            <Col md={3} sm={6} xs={12} key={product.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={product.image}
                  style={{ height: "200px", objectFit: "contain" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.title.slice(0, 50)}...</Card.Title>
                  <Card.Text className="text-danger fw-bold">
                    ₹{Math.ceil(product.price * 88)}
                  </Card.Text>
                  <Button
                    as={Link}
                    to={`/product/${product.id}`}
                    className="mt-auto rounded-pill"
                    variant="primary"
                  >
                    View Product
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </Row>
    </Container>
  );
}

export default SearchResults;
