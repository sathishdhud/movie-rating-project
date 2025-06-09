package com.example.movieapi.review.controller;

import org.springframework.web.bind.annotation.*;
import com.example.movieapi.review.model.Review;
import com.example.movieapi.review.service.ReviewService;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public Review submitReview(@RequestBody Review review) {
        return reviewService.submitReview(review);
    }

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    // ✅ Debug the title parameter
    @GetMapping("/title")
    public List<Review> getReviewsByTitle(@RequestParam String title) {
        System.out.println("🔍 Searching for reviews with title: " + title); // Debugging
        List<Review> reviews = reviewService.getReviewsByTitle(title);

        if (reviews.isEmpty()) {
            System.out.println("⚠️ No reviews found for title: " + title);
        } else {
            System.out.println("✅ Found " + reviews.size() + " reviews for: " + title);
        }

        return reviews;
    }
}
