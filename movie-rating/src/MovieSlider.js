import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaUser, FaMoon, FaSun } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function MovieSlider() {
  const [darkMode, setDarkMode] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [movies, setMovies] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/movies");
        setMovies(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setToken(null);
        }
      }
    };
    fetchMovies();
  }, [token]);

  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        setBackgroundIndex((prev) => (prev + 1) % movies.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [movies]);

  return (
    <div className={`position-relative min-vh-100 ${darkMode ? "bg-dark text-white" : "bg-white text-dark"}`}>
      
      {/* Background Transition */}
      <AnimatePresence mode="wait">
        {movies.length > 0 && (
          <motion.div
            key={backgroundIndex}
            className="position-absolute w-100 h-100"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div
              className="w-100 h-100"
              style={{
                backgroundImage: `url(${movies[backgroundIndex].imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark Overlay */}
      <div className="position-absolute w-100 h-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}></div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent position-relative z-1 px-4 py-3">
        <div className="container-fluid d-flex justify-content-between">
          <h4 className="navbar-brand mb-0 fw-bold text-white">🎬 MovieSlider</h4>
          <div className="d-flex gap-3 align-items-center">
            <button
              className="btn btn-outline-light btn-sm rounded-circle"
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle Theme"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <FaSearch className="text-white fs-5" />
            <FaUser className="text-white fs-5" />
          </div>
        </div>
      </nav>

      {/* Movie Cards */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-5 w-100 z-2">
        <div className="container d-flex flex-wrap justify-content-center gap-4">
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              whileHover={{ scale: 1.05 }}
              className="card bg-dark text-white shadow border-0"
              style={{ width: "150px", height: "230px", overflow: "hidden", cursor: "pointer" }}
            >
              <img
                src={movie.imageUrl}
                alt={movie.title}
                className="card-img"
                style={{ objectFit: "cover", height: "100%" }}
              />
              <div className="card-img-overlay d-flex align-items-end p-2" style={{ background: "rgba(0, 0, 0, 0.3)" }}>
                <h6 className="card-title text-truncate w-100">{movie.title}</h6>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
