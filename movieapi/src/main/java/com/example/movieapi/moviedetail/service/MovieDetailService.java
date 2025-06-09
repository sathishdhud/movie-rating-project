package com.example.movieapi.moviedetail.service;

import com.example.movieapi.moviedetail.model.MovieDetail;
import com.example.movieapi.moviedetail.repository.MovieDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieDetailService {

    @Autowired
    private MovieDetailRepository movieDetailRepository; // Fixed repository name

    public MovieDetail addMovie(MovieDetail movie) { // Changed return type
        return movieDetailRepository.save(movie);
    }

    public List<MovieDetail> getAllMovies() { // Changed return type
        return movieDetailRepository.findAll();
    }

    public MovieDetail getMovieById(Long id) { // Changed return type
        return movieDetailRepository.findById(id).orElse(null);
    }

    public void deleteMovie(Long id) {
        movieDetailRepository.deleteById(id);
    }
}
