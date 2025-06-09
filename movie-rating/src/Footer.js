import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-4 mt-5">
            <Container>
                <Row>
                    <Col md={4}>
                        <h5>New York</h5>
                        <p>957 Hill Hills Suite 491, United States</p>
                        <p><FontAwesomeIcon icon={faPhone} /> +12(3) 456 7890 1234</p>
                        <p><FontAwesomeIcon icon={faEnvelope} /> company@name.com</p>
                    </Col>
                    <Col md={4}>
                        <h5>Rome</h5>
                        <p>Piazza di Spagna, 00187 Roma RM, Italy</p>
                        <p><FontAwesomeIcon icon={faPhone} /> +12(3) 456 7890 1234</p>
                        <p><FontAwesomeIcon icon={faEnvelope} /> company@name.it</p>
                    </Col>
                    <Col md={4}>
                        <h5>London</h5>
                        <p>Fulham Rd, London SW6 1HS, United Kingdom</p>
                        <p><FontAwesomeIcon icon={faPhone} /> +12(3) 456 7890 1234</p>
                        <p><FontAwesomeIcon icon={faEnvelope} /> company@name.co.uk</p>
                    </Col>
                </Row>

                {/* Newsletter */}
                <Row className="mt-3">
                    <Col md={{ span: 6, offset: 3 }}>
                        <InputGroup>
                            <Form.Control type="email" placeholder="Your email" />
                            <Button variant="primary">Subscribe</Button>
                        </InputGroup>
                    </Col>
                </Row>

                <p className="text-center mt-3">&copy; 2024 Block Buster. All Rights Reserved.</p>
            </Container>
        </footer>
    );
};

export default Footer;
