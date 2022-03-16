import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SliceMap } from './components/Slice';
import ConfigPage from './components/ConfigPage';
import PiePage from './components/PiePage';
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
        <Route path="/config" element={<ConfigPage />} />
        <Route path="/pie" element={<PiePage />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="/" element={<Navigate replace to="/config" />} />
      </Routes>
    </div>
  );
}

export default App;
