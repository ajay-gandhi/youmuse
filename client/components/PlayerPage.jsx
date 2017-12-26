import "components/scss/PlayerPage.scss";

import React from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { connect } from "react-redux";
import { actions } from "components/store/Store";
import { withRouter } from "react-router-dom";

import SearchTab from "components/SearchTab";
import PlaylistTab from "components/PlaylistTab";
import SearchBar from "components/SearchBar";
import Queue from "components/Queue";
import Player from "components/Player";
import KeyboardControls from "components/KeyboardControls";
import { Tabs, Tab } from "react-bootstrap";

const playlistsEqual = (pl1, pl2) => {
  if (pl1.length !== pl2.length) return false;

  const ids1 = pl1.map(item => item.id);
  const ids2 = pl2.map(item => item.id);
  for (let i = 0; i < pl1.length; i++) {
    if (ids1[i] !== ids2[i]) return false;
  }

  return true;
};

class PlayerPage extends React.Component {
  static propTypes = {
    playlist: PropTypes.arrayOf(PropTypes.object),
    searchQuery: PropTypes.string,
    shuffle: PropTypes.bool,
    repeat: PropTypes.number,
    currentSong: PropTypes.object,
    updateSearchQuery: PropTypes.func,
    mergeState: PropTypes.func,
    fetchSearchResults: PropTypes.func,
    fetchPlaylist: PropTypes.func,
    history: PropTypes.object,
    match: PropTypes.object,
  };
  state = {
    currentPage: "search",
  };

  componentWillMount = () => {
    if (this.props.match.params.searchQuery) {
      this.props.updateSearchQuery(this.props.match.params.searchQuery);
      this.props.fetchSearchResults();
    }
    if (this.props.match.params.encodedPlaylist) {
      this.setState({ currentPage: "playlist" });
      const parts = this.props.match.params.encodedPlaylist.split("&");
      const playlistState = {
        shuffle: parts[1] === 1,
        repeat: Number(parts[2]),
      };
      this.props.mergeState(playlistState);
      if (parts[0]) this.props.fetchPlaylist(parts[0].split(","));
    } else if (this.props.match.path.indexOf("playlist") === 1) {
      this.setState({ currentPage: "playlist" });
    }
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.match.params.searchQuery && this.state.currentPage !== "search") {
      this.setState({ currentPage: "search" });
    }
    if (!playlistsEqual(nextProps.playlist, this.props.playlist) && this.state.currentPage === "playlist") {
      this.props.history.push(`/playlist/${this.encodePlaylist(nextProps.playlist)}`);
    }
  }

  encodePlaylist = (playlist = this.props.playlist) => {
    if (playlist.length > 0) {
      const videoIds = playlist.map(video => video.id);
      return `${videoIds.join(",")}&${Number(this.props.shuffle)}&${this.props.repeat}`;
    } else {
      return "";
    }
  }

  handleTabClick = (tab) => {
    const request = tab === "search" ? this.props.searchQuery : this.encodePlaylist();
    const route = `/${tab}/${request}`;
    this.props.history.push(route);
    this.setState({ currentPage: tab });
  }

  render = () => {
    return (
      <div className={ `PlayerPage ${this.props.currentSong ? "PlayerPage--withSong" : ""}` }>
        <KeyboardControls />
        <h1 className="PlayerPage__title">YouMuse</h1>
        <div className="PlayerPage__content">
          <div className="PlayerPage__content__LeftSection">
            <SearchBar />
            <Tabs
              activeKey={ this.state.currentPage }
              onSelect={ this.handleTabClick }
              id="PlayerNavigation"
              className="LeftSection__TabContainer"
            >
              <Tab eventKey="spacer" title=" " disabled></Tab>
              <Tab eventKey="search" title="Search">
                <SearchTab className="TabContainer__TabContent" />
              </Tab>
              <Tab eventKey="playlist" title="Playlist">
                <PlaylistTab className="TabContainer__TabContent" />
              </Tab>
            </Tabs>
          </div>
          <Queue className="PlayerPage__content__Queue" />
        </div>
        <Player />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    playlist: state.playlist.items,
    searchQuery: state.searchQuery || "",
    shuffle: state.shuffle,
    repeat: state.repeat,
    currentSong: state.currentSong,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateSearchQuery: searchQuery => dispatch(actions.setSearchQuery(searchQuery)),
    mergeState: newState => dispatch(actions.mergeState(newState)),
    fetchSearchResults: () => dispatch(actions.fetchSearchResults()),
    fetchPlaylist: videoIds => dispatch(actions.fetchPlaylist(videoIds)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(PlayerPage);
