/* global gapi */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { actions, store } from "components/store/Store";

import { DragDropContext } from "react-beautiful-dnd";

import IndexPage from "components/IndexPage";
import AboutPage from "components/AboutPage";
import PlayerPage from "components/PlayerPage";

class YouMuseApp extends React.Component {
  static propTypes = {
    movePlaylistItem: PropTypes.func,
    moveQueueItem: PropTypes.func,
    movePlaylistItemToQueue: PropTypes.func,
    updateDraggingType: PropTypes.func,
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

  onDragStart = initial => { this.props.updateDraggingType(initial.source.droppableId); }
  onDragEnd = (result) => {
    if (!result.destination) return;
    switch (result.source.droppableId) {
      case "droppable-playlist": {
        if (result.destination.droppableId === "droppable-playlist") {
          return this.props.movePlaylistItem(result.source.index, result.destination.index);
        } else {
          return this.props.movePlaylistItemToQueue(result.source.index, result.destination.index);
        }
      }
      case "droppable-queue": return this.props.moveQueueItem(result.source.index, result.destination.index);
    }
  }

  render = () => {
    if (!this.state.gapiLoaded) return <div />;
    return (
      <DragDropContext onDragStart={ this.onDragStart } onDragEnd={ this.onDragEnd }>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={ IndexPage } />
            <Route path="/about" exact component={ AboutPage } />
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
    movePlaylistItemToQueue: (source, dest) => dispatch(actions.movePlaylistItemToQueue(source, dest)),
    updateDraggingType: draggingType => dispatch(actions.updateDraggingType(draggingType)),
  };
};

const ConnectedYouMuseApp = connect(mapStateToProps, mapDispatchToProps)(YouMuseApp);

const YouMuseAppContainer = () => <Provider store={ store }><ConnectedYouMuseApp /></Provider>;
export default YouMuseAppContainer;
