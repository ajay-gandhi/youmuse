/* global gapi */

import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { store, actions } from "./store/Store";

import IndexPage from "./IndexPage";
import PlayerPage from "./PlayerPage";

const pathRegex = /^\/[^\/]*/;
const withMatchInState = (Component) => {
  return (props) => {
    const activeTabIndex = props.location.pathname.match(pathRegex)[0] === "/search" ? 1 : 2;
    store.dispatch(actions.mergeState({
      activeTabIndex: activeTabIndex,
      ...props.match.params,
    }));
    return <Component />;
  };
};

export default class YouMuseApp extends React.Component {
  state = {
    gapiLoaded: false,
  };

  componentDidMount = () => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";

    script.onload = () => {
      gapi.load("client", () => {
        gapi.client.init({ "apiKey": "AIzaSyDrBox3LPikkKNDZXBq3OzmcJ7N69bQ7II" });
        this.setState({ gapiLoaded: true });
      });
    };

    document.body.appendChild(script);
  }

  render = () => {
    if (!this.state.gapiLoaded) return <div />;
    return (
      <Provider store={ store }>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={ IndexPage } />
            <Route path="/search/:searchQuery?" exact component={ withMatchInState(PlayerPage) } />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}
