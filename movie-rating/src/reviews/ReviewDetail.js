import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaStar, FaUserCircle } from 'react-icons/fa';

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/moviedetails/${id}`);
        if (!response.ok) {
          throw new Error('Movie not found');
        }
        const data = await response.json();
        setMovie(data);
        fetchReviews(data.title); // Fetch reviews based on movie title
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const fetchReviews = async (title) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews?title=${encodeURIComponent(title)}`);
      if (response.ok) {
        const data = await response.json();

        if (data && data.length > 0) {
          const filteredReviews = data.filter((review) => review.movieTitle === title); // Filter reviews by movie title
          setReviews(filteredReviews);

          // Calculate the average rating
          const totalRating = filteredReviews.reduce((acc, review) => acc + review.rating, 0);
          const average = totalRating / filteredReviews.length;
          setAverageRating(average.toFixed(1)); // Set the average rating to 1 decimal place
        } else {
          setReviews([]); // If no reviews are found, set empty reviews array
          setAverageRating(0); // Reset average rating if no reviews
        }
      } else {
        console.error('Failed to fetch reviews: ', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    }
  };
  // ✅ Function to handle Review button click
  const handleReviewClick = () => {
    navigate(`/rating/${id}`); // Navigate to the review page
  };

  // Select Date and Time buttons logic
  const handleDateSelection = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error || !movie) {
    return <div className="text-center text-danger mt-5">Movie not found</div>;
  }

  return (
    <div className="container-fluid text-white" style={{ backgroundColor: '#222' }}>
      <div className="row">
        {/* Left Side - Image */}
        <div
          className="col-md-6 d-flex align-items-center justify-content-center"
          style={{
            backgroundImage: `url(${movie.posterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
          }}
        ></div>

        {/* Right Side */}
        <div className="col-md-6 p-5 d-flex flex-column" style={{ backgroundColor: '#222' }}>
          <h2 className="text-warning text-center">{movie.title}</h2>
          <p className="text-center">
            <strong>Genre:</strong> {movie.genre.join(", ")}
          </p>
          <p className="text-center">
            <strong>Director:</strong> {movie.director}
          </p>
          <p className="text-center">
            <strong>Cast:</strong> {movie.cast.join(", ")}
          </p>
          <p className="text-warning text-center">⭐ {averageRating}</p>

          {/* Rating Display */}
          <div className="rating-box p-3 border border-secondary rounded mb-4 bg-dark">
            <div className="d-flex align-items-center mb-3">
              <FaStar className="text-warning me-2" size={24} />
              <h4 className="mb-0">{averageRating}/5.0</h4>
              <small className="text-muted ms-2">{reviews.length} reviews</small>
            </div>
            <div className="d-flex">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(movie.rating) ? "text-warning" : "text-secondary"} />
              ))}
            </div>
          </div>

          {/* Review Button with Navigation */}
          <button className="btn btn-danger w-100 mb-4" onClick={handleReviewClick}>
            Review
          </button>

          {/* Select Date */}
          <div className="mt-3 text-center">
            <h3 className="mb-3">Select Date</h3>
            <div className="d-flex justify-content-center flex-wrap">
              {[21, 22, 23, 24, 25, 26, 27].map(date => (
                <button
                  key={date}
                  className={`btn m-1 px-3 ${selectedDate === date ? 'btn-danger' : 'btn-outline-light'}`}
                  onClick={() => handleDateSelection(date)}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          {/* Select Time */}
          <div className="mt-3 text-center">
            <h3 className="mb-3">Select Time</h3>
            <div className="d-flex justify-content-center flex-wrap">
              {["13:15", "15:15", "18:15", "20:30", "22:30"].map(time => (
                <button
                  key={time}
                  className={`btn m-1 px-4 ${selectedTime === time ? 'btn-danger' : 'btn-outline-light'}`}
                  onClick={() => handleTimeSelection(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Seat Selection */}
          <div className="mt-3 text-center">
            <h3 className="mb-3">Rating Overview</h3>
            <div className="d-flex flex-column align-items-center">
              {[...Array(7)].map((_, row) => (
                <div key={row} className="d-flex">
                  {[...Array(10)].map((_, col) => {
                    const colors = ["btn-danger", "btn-success", "btn-dark"];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];

                    // Creating an aisle after seat 4 and 6 for better theater layout
                    return (
                      <React.Fragment key={col}>
                        {col === 4 && <div style={{ width: "20px" }}></div>}
                        <button className={`btn ${randomColor} m-1 px-3 py-2`}></button>
                      </React.Fragment>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
