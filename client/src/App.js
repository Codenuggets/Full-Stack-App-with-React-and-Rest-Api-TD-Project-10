import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/Header';
import Courses from './components/Courses';
import withContext from './Context';

const CoursesWithContext = withContext(Courses);

export default () => (
  <BrowserRouter>
    <div>
      <Header />

      <Switch>
        <Route exact path="/" component={CoursesWithContext} />
      </Switch>
    </div>
  </BrowserRouter>
);
