import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "./store/Store";

class PlaylistItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object,
    index: PropTypes.number,
    removeItemFromPlaylist: PropTypes.func,
  };

  removeItem = () => {
    this.props.removeItemFromPlaylist(this.props.index);
  }

  render = () => {
    return (
      <div style={ { border: "1px solid red" } }>
        <h2>{ this.props.item.snippet.title }</h2>
        <h3>{ this.props.item.snippet.channelTitle }</h3>
        <span onClick={ this.removeItem }>Remove</span>
      </div>
    );
  }
}

class PlaylistTab extends React.Component {
  static propTypes = {
    playlist: PropTypes.arrayOf(PropTypes.object),
    removeItemFromPlaylist: PropTypes.func,
  };

  render = () => {
    const playlistItems = this.props.playlist.map((item, index) => (
      <PlaylistItem
        key={ item.id.videoId }
        item={ item }
        index={ index }
        removeItemFromPlaylist={ this.props.removeItemFromPlaylist }
      />
    ));

    return (
      <div className="playlistItems">
        { playlistItems }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    playlist: state.playlist,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    removeItemFromPlaylist: index => dispatch(actions.removeItemFromPlaylist(index)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistTab);
