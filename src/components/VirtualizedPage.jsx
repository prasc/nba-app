// src/components/VirtualizedPage.jsx
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import '../styles/VirtualizedPage.css';

// After imports
const itemCount = 10000; // Total number of items

const mockData = Array.from({ length: itemCount }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
  description: `This is a description for item ${index + 1}.`,
}));

// Inside the component
const VirtualizedPage = () => {
  const Row = ({ index, style }) => {
    const item = mockData[index];
    return (
      <div style={style} className="list-item">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
    );
  };

  return (
    <div>
      <h1>Virtualized List with Mock Data</h1>
      <List height={600} itemCount={itemCount} itemSize={50} width={'100%'}>
        {Row}
      </List>
    </div>
  );
};

export default VirtualizedPage;
