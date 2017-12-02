import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { store } from "./Store";

import IndexPage from "./IndexPage";
import SearchPage from "./SearchPage";

export default class YouMuseApp extends React.Component {
  render = () => {
    return (
      <Provider store={ store }>
        <BrowserRouter>
          <Switch>
            <Route path="/" component={ IndexPage } />
            <Route path="/search/:searchQuery?" component={ SearchPage } />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}
