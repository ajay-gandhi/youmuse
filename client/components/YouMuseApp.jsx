/* global gapi */

import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { store } from "components/store/Store";

import { DragDropContext } from "react-beautiful-dnd";

import IndexPage from "components/IndexPage";
import PlayerPage from "components/PlayerPage";

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

  onDragStart = () => console.log("started");
  onDragEnd = (result) => {
    console.log("dragend", result);
  }

  render = () => {
    if (!this.state.gapiLoaded) return <div />;
    return (
      <DragDropContext onDragStart={ this.onDragStart } onDragEnd={ this.onDragEnd }>
        <Provider store={ store }>
          <BrowserRouter>
            <Switch>
              <Route path="/" exact component={ IndexPage } />
              <Route path="/search/:searchQuery?" exact component={ PlayerPage } />
              <Route path="/playlist/:encodedPlaylist?" exact component={ PlayerPage } />
            </Switch>
          </BrowserRouter>
        </Provider>
      </DragDropContext>
    );
  }
}
