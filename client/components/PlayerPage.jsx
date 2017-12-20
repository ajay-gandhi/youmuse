import React from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { connect } from "react-redux";
import { actions } from "./store/Store";
import { withRouter } from "react-router-dom";

import SearchTab from "./SearchTab";
import PlaylistTab from "./PlaylistTab";
import Player from "./Player";
import { Button, Tabs, Tab } from "react-bootstrap";

class PlayerPage extends React.Component {
  static propTypes = {
    playlist: PropTypes.arrayOf(PropTypes.object),
    searchQuery: PropTypes.string,
    shuffle: PropTypes.bool,
    repeat: PropTypes.number,
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
    if (nextProps.playlist.length !== this.props.playlist.length && this.state.currentPage === "playlist") {
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

  handleSearchChange = e => this.props.updateSearchQuery(e.target.value)
  handleKeyPress = (e) => {
    if (e.key === "Enter") this.handleSearchClick();
  }
  handleSearchClick = () => {
    this.props.history.push(`/search/${this.props.searchQuery}`);
    this.props.fetchSearchResults();
    this.setState({ currentPage: "search" });
  }
  handleTabClick = (tab) => {
    const request = tab === "search" ? this.props.searchQuery : this.encodePlaylist();
    const route = `/${tab}/${request}`;
    this.props.history.push(route);
    this.setState({ currentPage: tab });
  }

  render = () => {
    return (
      <div>
        <h1>YouMuse Search</h1>
        <input
          placeholder="Search YouTube..."
          value={ this.props.searchQuery }
          onChange={ this.handleSearchChange }
          onKeyPress={ this.handleKeyPress }
        />
        <Button onClick={ this.handleSearchClick }>Search</Button>
        <Player />
        <Tabs activeKey={ this.state.currentPage } onSelect={ this.handleTabClick } id="PlayerNavigation">
          <Tab eventKey="search" title="Search">
            <SearchTab />
          </Tab>
          <Tab eventKey="playlist" title="Playlist">
            <PlaylistTab />
          </Tab>
        </Tabs>
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
