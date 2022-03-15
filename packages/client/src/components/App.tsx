import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SliceMap } from './Slice';
import ConfigPage from './ConfigPage';
import PiePage from './PiePage';

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
        <Route path="/" element={<Navigate replace to="/config" />} />
      </Routes>
    </div>
  );
}

export default App;
