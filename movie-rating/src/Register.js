import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import MovieSuccessModal from "./MovieSucessModal";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [modalMessage, setModalMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setShowModal(false);

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                setIsSuccess(true);
                setModalMessage("Registration successful! Click Continue to login.");
                setShowModal(true);
            } else {
                setIsSuccess(false);
                setModalMessage("Registration failed. Try again.");
                setShowModal(true);
            }
        } catch (error) {
            setError("Error: " + error.message);
        }
    };

    const handleContinue = () => {
        setShowModal(false);
        navigate("/login"); // Navigate to login after successful registration
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
            <div className="card p-4 shadow-lg text-white" 
                 style={{ width: "400px", backgroundColor: "#161b22", borderRadius: "10px", border: "1px solid #30363d" }}>
                <h3 className="text-center fw-bold mb-3">Register</h3>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label text-light fw-semibold">Username</label>
                        <input type="text" className="form-control text-white" placeholder="Enter username"
                               style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }}
                               value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-light fw-semibold">Password</label>
                        <input type="password" className="form-control text-white" placeholder="Enter password"
                               style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }}
                               value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-light fw-semibold">Confirm Password</label>
                        <input type="password" className="form-control text-white" placeholder="Confirm password"
                               style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }}
                               value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>

                    <button className="btn w-100 fw-bold btn-danger" type="submit">
                        Register
                    </button>
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
}

export default Register;
