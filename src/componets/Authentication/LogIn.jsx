import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from "../../Firebase";
import { ToastContainer, toast } from 'react-toastify';

function LogIn() {
  let [userData,setuserData] = useState({});
  let navigate = useNavigate();
  
      let getinput = (e) => {
          let name = e.target.name;
          let value = e.target.value;
          setuserData({...userData,[name]:value});
      }
      let submit = async (e) =>{
        e.preventDefault();
        await signInWithEmailAndPassword(auth,userData.email,userData.password).then((res)=>{
          let user=res.user;
          console.log(user);
          toast.success("Login successfully");
          setTimeout(() => {
            navigate("/")
          },5500)
          
        }).catch((err)=>{
          toast.error(err.message);
          
        })
        
      }
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow-lg p-4 rounded">
            <Card.Body>
              <h2 className="text-center fw-bold mb-4">🔐 Login</h2>
              <Form onSubmit={(e)=>submit(e)}>
                {/* Email Field */}
                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Form.Label><FaEnvelope className="me-2" />Email Address</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" className="py-2"  name="email" onChange={(e)=>getinput(e)}/>
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-3" controlId="formGroupPassword">
                  <Form.Label><FaLock className="me-2" />Password</Form.Label>
                  <Form.Control type="password" placeholder="Enter your password" className="py-2" name="password" onChange={(e)=>getinput(e)} />
                </Form.Group>

                {/* Forgot Password Link */}
                <div className="text-end">
                  <Link to="/forgot-password" className="text-decoration-none text-primary">Forgot Password?</Link>
                </div>

                {/* Login Button */}
                <Button variant="primary" className="w-100 mt-3 py-2" type='submit'>
                  Log In
                </Button>
              </Form>

              {/* Sign Up Link */}
              <div className="text-center mt-3">
                <span className="text-muted">New User? </span>
                <Link to="/signup" className="text-decoration-none fw-bold">Sign Up</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToastContainer/>
    </Container>
  );
}

export default LogIn;
