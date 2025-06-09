import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaShareAlt, FaHeart, FaUserCircle, FaFilm, FaVideo } from 'react-icons/fa';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
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
        console.log('Fetched Reviews:', data); // Debug log to check the response

        // If the title from the reviews API matches the movie title, display the reviews
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

  const handleReviewClick = () => {
    navigate(`/review/${id}`); // Navigate to the review page
  };

  const handleWatchTrailer = () => {
    if (movie.trailerUrl) {
      window.open(movie.trailerUrl, '_blank'); // Open trailer in a new tab
    } else {
      alert('Trailer not available');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container py-5 text-center vh-100 d-flex flex-column justify-content-center">
        <h2>Movie not found</h2>
        <p>Sorry, we couldn't find the movie you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="movie-detail text-white" style={{
      background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${movie.backgroundUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="img-fluid rounded mb-4"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            {/* Watch Trailer Button */}
            <button
              className="btn btn-outline-light btn-sm w-100 mb-3"
              onClick={handleWatchTrailer}
            >
              Watch Trailer
            </button>
            {/* Review Button */}
            <button
              className="btn btn-warning btn-sm w-100"
              onClick={handleReviewClick}
            >
              Add a Review
            </button>
          </div>
          <div className="col-md-8">
            <h1 className="mb-3">{movie.title.toUpperCase()} ({new Date(movie.releaseDate).getFullYear()})</h1>

            <div className="d-flex mb-4">
              <button className="btn btn-danger btn-sm me-3 d-flex align-items-center">
                <FaHeart className="me-1" /> ADD TO FAVOURITES
              </button>
              <button className="btn btn-outline-light btn-sm d-flex align-items-center">
                <FaShareAlt className="me-1" /> Share
              </button>
            </div>

            <div className="rating-box p-3 border border-secondary rounded mb-4 bg-dark">
              <div className="d-flex align-items-center mb-3">
                <FaStar className="text-warning me-2" size={24} />
                <h4 className="mb-0">{averageRating}/5.0</h4>
                <small className="text-muted ms-2">{reviews.length} reviews</small>
              </div>
              <div className="d-flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(averageRating) ? "text-warning" : "text-secondary"} />
                ))}
              </div>
            </div>

            <div className="nav nav-tabs border-0 mb-3">
              {['overview', 'cast', 'media', 'related', 'reviews'].map(tab => (
                <button
                  key={tab}
                  className={`nav-link border-0 ${activeTab === tab ? 'text-warning border-bottom border-warning' : 'text-white'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div>
                <p>{movie.synopsis}</p>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Director:</h6>
                    <p className="text-info">{movie.director}</p>
                    <h6>Writer:</h6>
                    <p className="text-info">{movie.writer}</p>
                    <h6>Stars:</h6>
                    <p className="text-info">{movie.cast.slice(0, 3).join(', ')}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Genres:</h6>
                    <p>
                      {movie.genre.map((g, i) => (
                        <span key={i} className="badge bg-info me-2">{g}</span>
                      ))}
                    </p>
                    <h6>Release Date:</h6>
                    <p>{new Date(movie.releaseDate).toLocaleDateString()}</p>
                    <h6>Run Time:</h6>
                    <p>144 mins</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h5>User Reviews</h5>
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
                  <p>No reviews available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
