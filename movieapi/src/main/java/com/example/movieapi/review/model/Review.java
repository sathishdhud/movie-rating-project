package com.example.movieapi.review.model;

import jakarta.persistence.*;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String reviewerName;
    private String email;
    private String movieTitle;
    private String director;
    private String cast;
    private int rating;

    // Constructors
    public Review() {}

    public Review(String reviewerName, String email, String movieTitle, String director, String cast, int rating) {
        this.reviewerName = reviewerName;
        this.email = email;
        this.movieTitle = movieTitle;
        this.director = director;
        this.cast = cast;
        this.rating = rating;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public String getCast() { return cast; }
    public void setCast(String cast) { this.cast = cast; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
}
