package com.example.movieapi.review.repository;



import com.example.movieapi.review.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Updated Query: Search across multiple fields while keeping the method name findByMovieTitle
    @Query("SELECT r FROM Review r WHERE " +
            "LOWER(r.movieTitle) LIKE LOWER(CONCAT('%', :title, '%')) OR " +
            "LOWER(r.director) LIKE LOWER(CONCAT('%', :title, '%')) OR " +
            "LOWER(r.cast) LIKE LOWER(CONCAT('%', :title, '%')) OR " +
            "LOWER(r.reviewerName) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Review> findByMovieTitle(@Param("title") String title);
}
