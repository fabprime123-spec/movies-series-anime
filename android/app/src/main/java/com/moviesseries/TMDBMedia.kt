package com.moviesseries

data class TMDBMedia(
    val id: Int,
    val title: String,
    val posterPath: String,
    val backdropPath: String,
    val voteAverage: Double,
    val mediaType: String
)
