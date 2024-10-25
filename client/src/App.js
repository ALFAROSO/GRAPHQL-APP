import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PersonShow from './pages/PersonShow';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/people/:id" element={<PersonShow />} />
      </Routes>
    </div>
  );
}

export default App;
