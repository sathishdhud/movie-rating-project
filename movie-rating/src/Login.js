import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import MovieSuccessModal from "./MovieSucessModal";

const Login = ({ setToken, setRole, setUsername }) => {
    const [localUsername, setLocalUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [modalMessage, setModalMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");
        const storedUsername = localStorage.getItem("username");

        if (token && userRole) {
            setRole(userRole);
            setUsername(storedUsername || "Guest");
        }
    }, [setRole, setUsername]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setShowModal(false);  // Reset modal on new login attempt
    
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username: localUsername, password }),
            });

            if (!response.ok) throw new Error("Invalid Credentials");

            const data = await response.json();
            const token = data.token;
            if (!token) throw new Error("Token missing in response");

            const decoded = jwtDecode(token);
            const userName = decoded.sub || "Guest";
            const userRole = data.role || "GUEST";

            localStorage.setItem("username", userName);
            localStorage.setItem("role", userRole);
            localStorage.setItem("token", token);

            setUsername(userName);
            setRole(userRole);
            setToken(token);

            // Set modal message to display role
            setIsSuccess(true);
            setModalMessage(`Logged in as ${userRole === "ADMIN" ? "ADMIN" : "USER"}! Click Continue to Proceed.`);
            setShowModal(true);
            
        } catch (err) {
            console.error("Login Error:", err.message);
            setError("Invalid credentials. Please try again.");
            setIsSuccess(false);
            setModalMessage("Invalid credentials. Please try again.");
            setShowModal(true);
        }
    };

    const handleContinue = () => {
        setShowModal(false);
        const userRole = localStorage.getItem("role") || "GUEST";
        navigate(userRole === "ADMIN" ? "/dashboard" : "/home");
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
            <div className="card p-4 shadow-lg text-white" 
                 style={{ width: "400px", backgroundColor: "#161b22", borderRadius: "10px", border: "1px solid #30363d" }}>
                <h3 className="text-center fw-bold mb-3">Login</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label text-light fw-semibold">Username</label>
                        <input type="text" className="form-control text-white" placeholder="Enter username"
                               style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }}
                               value={localUsername} onChange={(e) => setLocalUsername(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-light fw-semibold">Password</label>
                        <input type="password" className="form-control text-white" placeholder="Enter password"
                               style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }}
                               value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <button className="btn w-100 fw-bold btn-danger" type="submit">
                        Login
                    </button>

                    {/* Create Account Link */}
                    <p className="text-center mt-3">
                        <span className="text-light">Don't have an account? </span>
                        <button 
                            className="btn btn-link text-danger fw-bold p-0" 
                            onClick={() => navigate("/register")}
                            style={{ textDecoration: "none" }}>
                            Create your account
                        </button>
                    </p>
                </form>
                
                {error && (
                    <p className="text-danger mt-2 text-center">
                        <FontAwesomeIcon icon={faExclamationCircle} /> {error}
                    </p>
                )}
            </div>

            {/* Show the modal if `showModal` is true */}
            {showModal && (
                <MovieSuccessModal 
                    message={modalMessage} 
                    isSuccess={isSuccess} 
                    onClose={() => setShowModal(false)} 
                    onContinue={handleContinue} 
                />
            )}
        </div>
    );
};

export default Login;
