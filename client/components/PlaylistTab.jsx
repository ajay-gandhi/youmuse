import "components/scss/PlaylistTab.scss";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "components/store/Store";

import { Button } from "react-bootstrap";
import Icon from "components/Icon";
import Spinner from "components/Spinner";

class PlaylistItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object,
    index: PropTypes.number,
    removeItemFromPlaylist: PropTypes.func,
  };
  state = {
    clicked: false,
  };

  removeItem = () => {
    this.setState({ clicked: true });
    setTimeout(() => this.props.removeItemFromPlaylist(this.props.index), 200);
  }

  render = () => {
    const item = this.props.item.snippet;
    return (
      <div className={ `PlaylistItem ${this.state.clicked ? "PlaylistItem--clicked" : ""}` }>
        <div className="PlaylistItem__imageContainer">
          <img className="PlaylistItem__imageContainer__image" src={ item.thumbnails.default.url } />
        </div>
        <div className="PlaylistItem__textContent">
          <h3 className="PlaylistItem__textContent__heading">{ item.title }</h3>
          <h4 className="PlaylistItem__textContent__heading PlaylistItem__textContent__heading--channel">{ item.channelTitle }</h4>
        </div>
        <Button className="PlaylistItem__removeButton BorderlessButton" onClick={ this.removeItem }>
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
    let content;
    if (this.props.playlist.length) {
      content = this.props.playlist.map((item, index) => (
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
    } else {
      content = <div className="PlaylistTab__emptyNote">Playlist empty.</div>;
    }

    return (
      <div className={ `PlaylistTab ${this.props.className}` }>
        { this.props.isFetchingPlaylist ? <Spinner /> : content }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    playlist: state.playlist.items,
    isFetchingPlaylist: state.playlist.isFetching > 0,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    removeItemFromPlaylist: index => dispatch(actions.removeFromPlaylistByIndex(index)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistTab);
