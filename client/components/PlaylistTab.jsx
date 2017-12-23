import "./scss/PlaylistTab.scss";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "./store/Store";

import { Button } from "react-bootstrap";
import Icon from "./Icon";
import Spinner from "./Spinner";

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
    const item = this.props.item.snippet;
    return (
      <div className="PlaylistItem">
        <div className="PlaylistItem__imageContainer">
          <img className="PlaylistItem__imageContainer__image" src={ item.thumbnails.default.url } />
        </div>
        <div className="PlaylistItem__textContent">
          <h3 className="PlaylistItem__textContent__heading">{ item.title }</h3>
          <h4 className="PlaylistItem__textContent__heading PlaylistItem__textContent__heading--channel">{ item.channelTitle }</h4>
        </div>
        <Button className="PlaylistItem__removeButton BorderlessButton">
          <Icon glyph="remove_circle" />
        </Button>
      </div>
    );
  }
}

class PlaylistTab extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    playlist: PropTypes.arrayOf(PropTypes.object),
    isFetchingPlaylist: PropTypes.bool,
    removeItemFromPlaylist: PropTypes.func,
  };

  render = () => {
    const playlistItems = this.props.playlist.map((item, index) => (
      <div key={ item.id } className="PlaylistTab__PlaylistItemContainer">
        { index !== 0 && <hr className="PlaylistItemContainer__delimiter" /> }
        <PlaylistItem
          key={ `${item.id}-${index}` }
          item={ item }
          index={ index }
          removeItemFromPlaylist={ this.props.removeItemFromPlaylist }
        />
      </div>
    ));

    return (
      <div className={ `PlaylistTab ${this.props.className}` }>
        { playlistItems }
        { this.props.isFetchingPlaylist && <Spinner className="PlaylistTab__spinner" /> }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    playlist: state.playlist.items,
    isFetchingPlaylist: state.playlist.isFetching,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    removeItemFromPlaylist: index => dispatch(actions.removeItemFromPlaylist(index)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistTab);
