import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { Navbar, Nav, Container, Button, OverlayTrigger, Tooltip, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm, faSignOutAlt, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Home from "./Home";
import MovieDetail from "./moviedetails/MovieDetail";
import ReviewDetail from "./reviews/ReviewDetail";
import MovieReviewForm from "./MovieReviewForm";
import AddMovie from "./moviedetails/AddMovie";
import Footer from "./Footer";  // ✅ Footer Component Imported
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [username, setUsername] = useState(localStorage.getItem("username") || "Guest");
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");
        let storedUsername = localStorage.getItem("username") || "Guest";

        setToken(storedToken);
        setRole(storedRole);
        setUsername(storedRole === "ADMIN" ? "Admin" : storedUsername);
    }, []);

    useEffect(() => {
        document.body.className = darkMode ? "bg-dark text-white" : "bg-light text-dark";
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    const handleLogout = () => {
        localStorage.clear();
        setToken(null);
        setRole(null);
        setUsername("Guest");
    };

    return (
        <Router>
            <div>
                {token ? (
                    <>
                        {/* ✅ Navbar */}
                        <Navbar bg={darkMode ? "dark" : "light"} variant={darkMode ? "dark" : "light"} expand="lg">
                            <Container>
                                <Navbar.Brand as={Link} to={role === "ADMIN" ? "/dashboard" : "/home"}>
                                    <FontAwesomeIcon icon={faFilm} className="me-2" /> Block Buster
                                </Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="me-auto">
                                        {role === "ADMIN" ? (
                                            <>
                                                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                                                <Nav.Link as={Link} to="/add-movie">Add Movie</Nav.Link>
                                            </>
                                        ) : (
                                            <Nav.Link as={Link} to="/home">Home</Nav.Link>
                                        )}
                                    </Nav>
                                    <div className="ms-auto d-flex align-items-center">
                                        <Button variant={darkMode ? "light" : "dark"} onClick={() => setDarkMode(!darkMode)} className="me-3">
                                            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                                        </Button>
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip>{username}</Tooltip>}>
                                            <Image src={role === "ADMIN" ? "/admin.png" : "/user.png"} alt="avatar" className="avatar" roundedCircle style={{ width: "40px", height: "40px", cursor: "pointer" }} />
                                        </OverlayTrigger>
                                        <Button variant="outline-danger" onClick={handleLogout} className="ms-3">
                                            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Logout
                                        </Button>
                                    </div>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>

                        {/* ✅ Routes */}
                        <Routes>
                            {role === "ADMIN" ? (
                                <>
                                    <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
                                    <Route path="/add-movie" element={<AddMovie darkMode={darkMode} />} />
                                    <Route path="*" element={<Navigate to="/dashboard" />} />
                                </>
                            ) : (
                                <>
                                    <Route path="/home" element={<Home darkMode={darkMode} />} />
                                    <Route path="/movie/:id" element={<MovieDetail darkMode={darkMode} />} />
                                    <Route path="/review/:id" element={<ReviewDetail darkMode={darkMode} />} />
                                    <Route path="/rating/:id" element={<MovieReviewForm darkMode={darkMode} />} />
                                    <Route path="*" element={<Navigate to="/home" />} />
                                </>
                            )}
                        </Routes>

                        {/* ✅ Footer Component */}
                        <Footer />
                    </>
                ) : (
                    <Routes>
                        <Route path="/login" element={<Login setToken={setToken} setRole={setRole} setUsername={setUsername} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                )}
            </div>
        </Router>
    );
}

export default App;
