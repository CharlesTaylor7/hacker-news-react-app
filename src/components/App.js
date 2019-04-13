import React, { useState, useEffect } from 'react';
import './App.css';
import * as HN from '../HackerNewsAPI';
import Item from './Item';

export const App = () => {
  const [latestId, setLatestId] = useState(null);
  useEffect(() => {
    HN.latestItem$.subscribe(setLatestId);
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>{null}</header>
    </div>
  );
};
