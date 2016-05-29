/**
 * Main entry point for the Styleguide Client
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {
  Route,
  Router,
  hashHistory,
} from 'react-router';
import Plugins from './components/Plugins';
import App from './components/App';
import map from 'lodash/map';

window.$INITIALIZE_COMPONENT_GUI = function initializeComponentGui(components) {
  // Generate a view per user component that renders the frontend part of the
  // plugins for each component
  const routes = map(components, (component, componentPath) => {
    return (
      <Route
        key={componentPath}
        path={componentPath}
        component={() => <Plugins path={componentPath} componentData={component} />}
      />
    );
  });

  ReactDOM.render(
    <Router history={hashHistory}>
      <Route path="/" component={() => <App components={components} />}>
        {routes}
      </Route>
    </Router>,
    document.getElementById('styleguide-root')
  );
};
