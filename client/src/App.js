import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/Header';

export default () => (
  <BrowserRouter>
    <div>
      <Header />
    </div>
  </BrowserRouter>
);
