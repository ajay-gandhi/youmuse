import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { actions } from "./store/Store";

class PlaylistItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object,
    index: PropTypes.number,
  };

  render = () => {
    return (
      <div style={ { border: "1px solid red" } }>
        <h2>{ this.props.item.snippet.title }</h2>
        <h3>{ this.props.item.snippet.channelTitle }</h3>
      </div>
    );
  }
}

class PlaylistTab extends React.Component {
  static propTypes = {
    playlist: PropTypes.arrayOf(PropTypes.object),
  };

  render = () => {
    const playlistItems = this.props.playlist.map((item, index) => (
      <PlaylistItem
        key={ item.id.videoId }
        item={ item }
        index={ index }
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
// const mapDispatchToProps = (dispatch) => {
const mapDispatchToProps = () => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistTab);
