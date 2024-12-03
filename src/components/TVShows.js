import React, { useState, useEffect } from 'react';

function TVShows({ searchQuery }) {
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const API_KEY = process.env.REACT_APP_TMDB_TOKEN;

  useEffect(() => {
    if (searchQuery) {
      searchTVShows(searchQuery);
    } else {
      fetchShows(1);
    }
  }, [searchQuery]);

  const searchTVShows = async (query) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${query}&include_adult=false`
      );
      const data = await response.json();
      setShows(data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error searching TV shows:', error);
      setLoading(false);
    }
  };

  const fetchShows = async (pageNumber) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&page=${pageNumber}`
      );
      const data = await response.json();
      if (pageNumber === 1) {
        setShows(data.results);
      } else {
        setShows(prevShows => [...prevShows, ...data.results]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
      setLoading(false);
    }
  };

  const handleShowClick = async (showId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}?api_key=${API_KEY}&append_to_response=credits`
      );
      const data = await response.json();
      setSelectedShow(data);
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  const loadMore = () => {
    if (!searchQuery) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchShows(nextPage);
    }
  };

  const fetchTrailer = async (showId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}/videos?api_key=${API_KEY}&language=en-US`
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
      <h1>TV Shows</h1>
      <div className="movie-container">
        {shows.length > 0 ? (
          shows.map((show) => (
            <div 
              key={show.id} 
              className="movie-card"
              onClick={() => handleShowClick(show.id)}
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
          ))
        ) : (
          <p>No TV shows found for "{searchQuery}"</p>
        )}
      </div>

      {!searchQuery && !loading && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={loadMore}>
            Load More Shows
          </button>
        </div>
      )}

      {loading && <div className="loading">Loading...</div>}

      {/* Modal untuk detail TV Show */}
      {selectedShow && (
        <div className="modal" onClick={() => setSelectedShow(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
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
            <button className="close-btn" onClick={() => setSelectedShow(null)}>×</button>
            <div className="modal-hero">
              <img 
                src={`https://image.tmdb.org/t/p/original${selectedShow.backdrop_path}`}
                alt={selectedShow.name}
                className="modal-backdrop"
              />
              <div className="modal-hero-content">
                <h2>{selectedShow.name}</h2>
                <div className="modal-meta">
                  <span className="rating">⭐ {selectedShow.vote_average?.toFixed(1)}</span>
                  <span>{selectedShow.first_air_date?.split('-')[0]}</span>
                  <span>{selectedShow.number_of_seasons} Seasons</span>
                </div>
                <div className="modal-buttons">
                  <button 
                    className="play-btn"
                    onClick={() => fetchTrailer(selectedShow.id)}
                  >
                    ▶ Watch Trailer
                  </button>
                </div>
                <h3 className="overview-title">Storyline</h3>
                <p className="modal-overview">{selectedShow.overview}</p>
              </div>
            </div>

            <div className="modal-details-section">
              <h2 className="section-overview-title">Overview</h2>
              <div className="details-container">
                <div className="poster-container">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${selectedShow.poster_path}`}
                    alt={selectedShow.name}
                    className="detail-poster"
                  />
                </div>
                <div className="movie-details">
                  <div className="detail-item">
                    <span className="detail-label">First Aired</span>
                    <span className="detail-value">{selectedShow.first_air_date}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Seasons</span>
                    <span className="detail-value">{selectedShow.number_of_seasons}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Episodes</span>
                    <span className="detail-value">{selectedShow.number_of_episodes}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className="detail-value">{selectedShow.status}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Genre</span>
                    <span className="detail-value">
                      {selectedShow.genres?.map(genre => genre.name).join(', ')}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Network</span>
                    <span className="detail-value">
                      {selectedShow.networks?.map(network => network.name).join(', ')}
                    </span>
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

export default TVShows; 
