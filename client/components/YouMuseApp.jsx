/* global gapi */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { actions, store } from "components/store/Store";

import { DragDropContext } from "react-beautiful-dnd";

import IndexPage from "components/IndexPage";
import PlayerPage from "components/PlayerPage";

class YouMuseApp extends React.Component {
  static propTypes = {
    movePlaylistItem: PropTypes.func,
    moveQueueItem: PropTypes.func,
  };
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

  onDragStart = () => {}
  onDragEnd = (result) => {
    if (!result.destination) return;
    switch (result.type) {
      case "PLAYLIST_ITEM": return this.props.movePlaylistItem(result.source.index, result.destination.index);
      case "QUEUE_ITEM": return this.props.moveQueueItem(result.source.index, result.destination.index);
    }
  }

  render = () => {
    if (!this.state.gapiLoaded) return <div />;
    return (
      <DragDropContext onDragStart={ this.onDragStart } onDragEnd={ this.onDragEnd }>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={ IndexPage } />
            <Route path="/search/:searchQuery?" exact component={ PlayerPage } />
            <Route path="/playlist/:encodedPlaylist?" exact component={ PlayerPage } />
          </Switch>
        </BrowserRouter>
      </DragDropContext>
    );
  }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => {
  return {
    movePlaylistItem: (source, dest) => dispatch(actions.movePlaylistItem(source, dest)),
    moveQueueItem: (source, dest) => dispatch(actions.moveQueueItem(source, dest)),
  };
};

const ConnectedYouMuseApp = connect(mapStateToProps, mapDispatchToProps)(YouMuseApp);

const YouMuseAppContainer = () => <Provider store={ store }><ConnectedYouMuseApp /></Provider>;
export default YouMuseAppContainer;
