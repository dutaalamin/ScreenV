import React, { useState, useEffect } from 'react';

function Movies({ searchQuery }) {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const API_KEY = process.env.REACT_APP_TMDB_TOKEN;

  useEffect(() => {
    if (searchQuery) {
      searchMovies(searchQuery);
    } else {
      fetchMovies(1);
    }
  }, [searchQuery]);

  const searchMovies = async (query) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&include_adult=false`
      );
      const data = await response.json();
      setMovies(data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error searching movies:', error);
      setLoading(false);
    }
  };

  const fetchMovies = async (pageNumber) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}`
      );
      const data = await response.json();
      if (pageNumber === 1) {
        setMovies(data.results);
      } else {
        setMovies(prevMovies => [...prevMovies, ...data.results]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const handleMovieClick = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`
      );
      const data = await response.json();
      setSelectedMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const loadMore = () => {
    if (!searchQuery) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage);
    }
  };

  const fetchTrailer = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
      );
      const data = await response.json();
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailer) {
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
      } else {
        alert('Trailer tidak tersedia');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      alert('Error loading trailer');
    }
  };

  return (
    <div>
      <h1>Movies</h1>
      <div className="movie-container">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div 
              key={movie.id} 
              className="movie-card"
              onClick={() => handleMovieClick(movie.id)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
                loading="lazy"
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <div className="movie-meta">
                  <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No movies found for "{searchQuery}"</p>
        )}
      </div>

      {!searchQuery && !loading && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={loadMore}>
            Load More Movies
          </button>
        </div>
      )}

      {loading && <div className="loading">Loading...</div>}

      {selectedMovie && (
        <div className="modal" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedMovie(null)}>×</button>
            <div className="modal-hero">
              <img 
                src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`}
                alt={selectedMovie.title}
                className="modal-backdrop"
              />
              <div className="modal-hero-content">
                <h2>{selectedMovie.title}</h2>
                <div className="modal-meta">
                  <span className="rating">⭐ {selectedMovie.vote_average?.toFixed(1)}</span>
                  <span>{selectedMovie.release_date?.split('-')[0]}</span>
                  <span>{selectedMovie.runtime} min</span>
                </div>
                <div className="modal-buttons">
                  <button 
                    className="play-btn"
                    onClick={() => fetchTrailer(selectedMovie.id)}
                  >
                    ▶ Watch Trailer
                  </button>
                </div>
                <h3 className="overview-title">Storyline</h3>
                <p className="modal-overview">{selectedMovie.overview}</p>
              </div>
            </div>

            <div className="modal-details-section">
              <h2 className="section-overview-title">Overview</h2>
              <div className="details-container">
                <div className="poster-container">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    className="detail-poster"
                  />
                </div>
                <div className="movie-details">
                  <div className="detail-item">
                    <span className="detail-label">Released</span>
                    <span className="detail-value">{selectedMovie.release_date}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Runtime</span>
                    <span className="detail-value">{selectedMovie.runtime} minutes</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Budget</span>
                    <span className="detail-value">${selectedMovie.budget?.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Revenue</span>
                    <span className="detail-value">${selectedMovie.revenue?.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Genre</span>
                    <span className="detail-value">
                      {selectedMovie.genres?.map(genre => genre.name).join(', ')}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className="detail-value">{selectedMovie.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movies; 