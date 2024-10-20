// src/PlayersList.jsx
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const PlayersList = () => {
  const [players, setPlayers] = useState([]);
  const [cursor, setCursor] = useState(0); // Start cursor at 0
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.balldontlie.io/v1/players?cursor=${cursor}&per_page=10`,
        {
          headers: {
            Authorization: 'ffbdd74f-2b27-484b-9590-5823d8668f02',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Check your API key.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();

      setPlayers((prevPlayers) => [...prevPlayers, ...data.data]);

      if (data.meta.next_cursor) {
        setCursor(data.meta.next_cursor);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchPlayers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div>
      <h1>NBA Players</h1>
      <ul>
        {players.map((player, index) => (
          <li key={player.id} ref={index === players.length - 1 ? ref : null}>
            {`${player.first_name} ${player.last_name}`}
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more players to load.</p>}
    </div>
  );
};

export default PlayersList;
