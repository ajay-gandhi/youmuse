/* global gapi */

import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { store } from "./store/Store";

import IndexPage from "./IndexPage";
import PlayerPage from "./PlayerPage";

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
            <Route path="/search/:searchQuery?" exact component={ PlayerPage } />
            <Route path="/playlist/:encodedPlaylist?" exact component={ PlayerPage } />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}
