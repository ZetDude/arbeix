import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import EntryPage from './containers/EntryPage';
import ProductPage from './containers/ProductPage';
import DetailPage from './containers/DetailPage';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.KODU} exact component={HomePage} />
        <Route path={routes.KOOSTA} component={EntryPage} />
        <Route path={routes.TOOTED} component={ProductPage} />
        <Route path={`${routes._DETAIL}:product`} component={DetailPage} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </App>
  );
}
