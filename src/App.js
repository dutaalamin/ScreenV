import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import Home from './components/Home';
import Movies from './components/Movies';
import TVShows from './components/TVShows';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-content">
            <div className="nav-left">
              <Link to="/" className="brand-logo">ScreenV</Link>
              <div className="nav-links">
                <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} end>
                  Home
                </NavLink>
                <NavLink to="/movies" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                  Movies
                </NavLink>
                <NavLink to="/tvshows" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                  TV Shows
                </NavLink>
              </div>
            </div>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <i className="fas fa-search search-icon"></i>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/movies" element={<Movies searchQuery={searchQuery} />} />
          <Route path="/tvshows" element={<TVShows searchQuery={searchQuery} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
