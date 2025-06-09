package com.example.movieapi.review.service;

import com.example.movieapi.review.model.Review;
import com.example.movieapi.review.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public Review submitReview(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // 🔹 New method to get reviews by movie title
    public List<Review> getReviewsByTitle(String title) {
        return reviewRepository.findByMovieTitle(title);
    }
}
