import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserCircle, FaFilm, FaVideo, FaStar } from "react-icons/fa";

const ReviewsByTitle = () => {
  const [title, setTitle] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAllReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(response.data.slice(0, 20));
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("Failed to fetch reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllReviews();
  }, []);

  const fetchReviewsByTitle = debounce(async (searchTitle) => {
    if (!searchTitle.trim()) return;
    setLoading(true);
    setError("");
    try {
      const url = `http://localhost:8080/api/reviews/title?title=${encodeURIComponent(searchTitle)}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(response.data.slice(0, 20));
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError("Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    if (title.trim() === "") {
      const fetchDefaultReviews = async () => {
        try {
          const response = await axios.get("http://localhost:8080/api/reviews", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setReviews(response.data.slice(0, 20));
        } catch (err) {
          console.error("API Fetch Error:", err);
        }
      };
      fetchDefaultReviews();
    } else {
      fetchReviewsByTitle(title);
    }
    return () => fetchReviewsByTitle.cancel();
  }, [title]);

  return (
    <div className="container py-5" style={{ minHeight: "100vh", backgroundColor: "btn-secondary" }}>
      <div className="card bg-dark text-light border-0 shadow-lg p-3 rounded-3" style={{ maxWidth: "600px", margin: "auto" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-white">Latest Reviews</h5>
          <a href="#" className="text-primary fw-bold">View all</a>
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control bg-secondary text-white border-0 shadow-sm rounded-pill px-3"
            placeholder="Search for a movie..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {loading && <p className="text-warning text-center">Loading...</p>}
        {error && <p className="text-danger text-center">{error}</p>}
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="d-flex align-items-center border-bottom border-secondary py-2">
              <FaUserCircle className="text-primary me-2" size={40} />
              <div className="flex-grow-1">
                <h6 className="mb-1 text-white fw-bold">{review.movieTitle}</h6>
                <p className="mb-0 text-white small"><FaFilm className="me-1" /> Cast: {review.cast}</p>
                <p className="mb-0 text-white small"><FaVideo className="me-1" /> Director: {review.director}</p>
                <p className="mb-0 text-warning fw-bold">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-warning me-1" />
                  ))}
                </p>
              </div>
              <span className="text-light fw-bold small">{review.reviewerName}</span>
            </div>
          ))
        ) : (
          <p className="text-secondary text-center">No matching reviews found.</p>
        )}
        <div className="text-center mt-3">
          <button className="btn btn-secondary rounded-pill shadow-lg px-3 py-1">Load More</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsByTitle;