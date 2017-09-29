// @flow
import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import ErrorBoundary from 'components/ErrorBoundary';
import AppError from 'components/AppError';
import Header from 'components/Header';
import Budget from 'routes/Budget';
import Reports from 'routes/Reports';
import Transaction from 'routes/Transaction';
import './style.scss';

import permalinks from 'routes/permalinks';

const App = () => (
  <ErrorBoundary fallbackComponent={AppError}>
    <main>
      <Header />

      <Switch>
        <Route path={`/${permalinks.budget}`} component={Budget} />
        <Route path="/reports" component={Reports} />
        <Route path="/transaction/:id" component={Transaction} />
        <Redirect to={`/${permalinks.budget}`} />
      </Switch>
    </main>
  </ErrorBoundary>
);

export default App;
