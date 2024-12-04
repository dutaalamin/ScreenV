import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home({ searchQuery }) {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTVShows, setTrendingTVShows] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState('');
  const [trendingContent, setTrendingContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const API_KEY = process.env.REACT_APP_TMDB_TOKEN;

  useEffect(() => {
    fetchPopularMovies();
    fetchTrendingMovies();
    fetchTrendingTVShows();
    fetchTrending();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      searchMovies(searchQuery);
    }
  }, [searchQuery]);

  const searchMovies = async (query) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}&include_adult=false`
      );
      const data = await response.json();
      setSearchResults(data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error searching:', error);
      setLoading(false);
    }
  };

  const fetchPopularMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
    }
  };

  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
      );
      const data = await response.json();
      setTrendingMovies(data.results);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  };

  const fetchTrendingTVShows = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`
      );
      const data = await response.json();
      setTrendingTVShows(data.results);
    } catch (error) {
      console.error('Error fetching trending TV shows:', error);
    }
  };

  const fetchTrending = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`
      );
      const data = await response.json();
      setTrendingContent(data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trending content:', error);
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

  // Filter movies based on searchQuery
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter trending movies based on searchQuery
  const filteredTrendingMovies = trendingMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter trending TV shows based on searchQuery
  const filteredTrendingTVShows = trendingTVShows.filter(show =>
    show.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter trending content based on searchQuery
  const filteredTrendingContent = trendingContent.filter(item =>
    (item.title || item.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(filteredTrendingContent);

  return (
    <div>
      {searchQuery ? (
        <div>
          <h2>Search Results for "{searchQuery}"</h2>
          <div className="movie-container">
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <div 
                  key={item.id} 
                  className="movie-card"
                  onClick={() => handleMovieClick(item.id)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="movie-poster"
                    loading="lazy"
                  />
                  <div className="movie-info">
                    <h3>{item.title || item.name}</h3>
                    <div className="movie-meta">
                      <span className="rating">⭐ {item.vote_average?.toFixed(1)}</span>
                      <span className="media-type">{item.media_type === 'movie' ? 'Movie' : 'TV Show'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No results found for "{searchQuery}"</p>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Featured Movie */}
          {movies.length > 0 && (
            <header 
              className="featured-movie"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(0,0,0,0.8) 0%, transparent 60%),
                  linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%),
                  url(https://image.tmdb.org/t/p/original${movies[0].backdrop_path})
                `,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="featured-content">
                <h1>{movies[0].title}</h1>
                <p>{movies[0].overview}</p>
                <div className="featured-buttons">
                  <button 
                    className="play-btn"
                    onClick={() => fetchTrailer(movies[0].id)}
                  >
                    ▶ Watch Trailer
                  </button>
                </div>
              </div>
            </header>
          )}

          {/* Popular Movies */}
          <main className="movie-grid">
            <div className="section-header">
              <h2 className="section-title">Popular Movies</h2>
              <Link to="/movies" className="explore-btn">
                Explore All
              </Link>
            </div>
            <div className="movie-container">
              {movies.slice(0, 6).map((movie) => (
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
              ))}
            </div>
          </main>

          {/* Trending Movies */}
          <section className="movie-grid">
            <div className="section-header">
              <h2 className="section-title">Trending Movies</h2>
              <Link to="/movies" className="explore-btn">
                Explore All
              </Link>
            </div>
            <div className="movie-container">
              {filteredTrendingMovies.slice(0, 6).map((movie) => (
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
              ))}
            </div>
          </section>

          {/* Trending TV Shows */}
          <section className="movie-grid">
            <div className="section-header">
              <h2 className="section-title">Trending TV Shows</h2>
              <Link to="/tvshows" className="explore-btn">
                Explore All
              </Link>
            </div>
            <div className="movie-container">
              {filteredTrendingTVShows.slice(0, 6).map((show) => (
                <div 
                  key={show.id} 
                  className="movie-card"
                  onClick={() => handleMovieClick(show.id)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    className="movie-poster"
                    loading="lazy"
                  />
                  <div className="movie-info">
                    <h3>{show.name}</h3>
                    <div className="movie-meta">
                      <span className="rating">⭐ {show.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trending This Week */}
          <section className="movie-grid">
            <div className="section-header">
              <h2 className="section-title">Trending This Week</h2>
              <Link to="/movies" className="explore-btn">
                Explore All
              </Link>
            </div>
            <div className="movie-container">
              {filteredTrendingContent.map((item) => (
                <div 
                  key={item.id} 
                  className="movie-card"
                  onClick={() => handleMovieClick(item.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="movie-poster"
                    loading="lazy"
                  />
                  <div className="movie-info">
                    <h3>{item.title || item.name}</h3>
                    <div className="movie-meta">
                      <span className="rating">
                        ⭐ {item.vote_average !== undefined ? item.vote_average.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedMovie(null)}>×</button>
            
            <nav className="navbar">
              <div className="navbar-content">
                <div className="nav-left">
                  <a href="/" className="brand-logo">ScreenV</a>
                  <div className="nav-links">
                    <a href="/" className="nav-link">Home</a>
                    <a href="/movies" className="nav-link">Movies</a>
                    <a href="/tvshows" className="nav-link">TV Shows</a>
                  </div>
                </div>
                <div className="search-container">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                  />
                  <i className="fas fa-search search-icon"></i>
                </div>
              </div>
            </nav>
            
            <div className="modal-hero">
              <img 
                src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`}
                alt={selectedMovie.title}
                className="modal-backdrop"
              />
              <div className="modal-hero-content">
                <h2>{selectedMovie.title}</h2>
                <div className="modal-meta">
                  <span className="rating">⭐ {selectedMovie.vote_average.toFixed(1)}</span>
                  <span>{selectedMovie.release_date.split('-')[0]}</span>
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
                  <div className="detail-item">
                    <span className="detail-label">Language</span>
                    <span className="detail-value">{selectedMovie.original_language?.toUpperCase()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Production</span>
                    <span className="detail-value">
                      {selectedMovie.production_companies?.map(company => company.name).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && <div className="loading">Loading...</div>}
    </div>
  );
}

export default Home; 
