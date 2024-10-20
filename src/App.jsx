// src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Autocomplete from './components/Autocomplete';
import VirtualizedPage from './components/VirtualizedPage';
import PlayersList from './components/PlayersList';

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Autocomplete</Link> |{' '}
        <Link to="/virtualized">Virtualized List</Link> |{' '}
        <Link to="/playerslist">Players List</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Autocomplete />} />
        <Route path="/virtualized" element={<VirtualizedPage />} />
        <Route path="/playersList" element={<PlayersList />} />
      </Routes>
    </div>
  );
}

export default App;
