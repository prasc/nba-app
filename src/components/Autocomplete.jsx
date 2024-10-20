// src/components/Autocomplete.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../styles/Autocomplete.css';

const Autocomplete = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const inputRef = useRef(null);

  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setActiveIndex(-1);
    setShowSuggestions(true);
  };

  // Handle suggestion click
  const handleSuggestionClick = (player) => {
    setQuery(`${player.first_name} ${player.last_name}`);
    setShowSuggestions(false);
    fetchPlayerDetails(player.id);
  };

  // Fetch suggestions with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 0) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchPlayerDetails = async (playerId) => {
    try {
      const response = await fetch(
        `https://api.balldontlie.io/v1/players/${playerId}`,
        {
          headers: {
            Authorization: 'ffbdd74f-2b27-484b-9590-5823d8668f02',
          },
        }
      );
      const data = await response.json();
      setSelectedPlayer(data.data);
    } catch (error) {
      console.error('Error fetching player details:', error);
    }
  };

  const fetchSuggestions = async (searchTerm) => {
    try {
      const response = await fetch(
        `https://api.balldontlie.io/v1/players?per_page=10&search=${searchTerm}`,
        {
          headers: {
            Authorization: 'ffbdd74f-2b27-484b-9590-5823d8668f02',
          },
        }
      );
      const data = await response.json();
      setSuggestions(data.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.autocomplete')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="autocomplete">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search NBA Players"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />
        {showSuggestions && query.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.length > 0 ? (
              suggestions.map((player, index) => {
                const isActive = index === activeIndex;
                return (
                  <li
                    key={player.id}
                    className={isActive ? 'active' : ''}
                    onClick={() => handleSuggestionClick(player)}
                  >
                    {`${player.first_name} ${player.last_name}`}
                  </li>
                );
              })
            ) : (
              <li className="no-suggestions">
                <em>No results found</em>
              </li>
            )}
          </ul>
        )}
      </div>
      {selectedPlayer && (
        <div className="player-details">
          <h2>{`${selectedPlayer.first_name} ${selectedPlayer.last_name}`}</h2>
          <p>Position: {selectedPlayer.position || 'N/A'}</p>
          <p>Height: {selectedPlayer.height || 'N/A'}</p>
          <p>Weight: {selectedPlayer.weight || 'N/A'}</p>
          <p>
            Team: {selectedPlayer.team ? selectedPlayer.team.full_name : 'N/A'}
          </p>
        </div>
      )}
    </>
  );
};

export default Autocomplete;
