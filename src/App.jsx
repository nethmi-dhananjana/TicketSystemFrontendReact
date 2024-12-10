import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';

const App = () => {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path ="/" element={<Dashboard/>}/>
        </Routes>

      </Router>
     
    </div>
  );
};

export default App;
