import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SliceMap } from './components/Slice';
import HomePage from './pages/HomePage';
import ChartPage from './pages/ChartPage';

export type QueryData = {
  size: number;
  color: string;
  strokeWidth: number;
  mode: 'dark' | 'light';
  slices: SliceMap;
};

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chart" element={<ChartPage />} />
      </Routes>
    </div>
  );
}

export default App;
