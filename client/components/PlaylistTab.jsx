import "components/scss/PlaylistTab.scss";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "components/store/Store";

import { Draggable, Droppable } from "react-beautiful-dnd";

import { Button } from "react-bootstrap";
import Icon from "components/Icon";
import Spinner from "components/Spinner";

class PlaylistItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object,
    index: PropTypes.number,
    isFetching: PropTypes.bool,
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
    const clickedClassName = this.state.clicked ? "PlaylistItem--clicked" : "";
    const draggableClassName = this.props.isFetching ? "" : "isDraggable";
    return (
      <Draggable
        draggableId={ `draggable-playlistItem-${this.props.item.id}` }
        type="PLAYLIST_ITEM"
        isDragDisabled={ this.props.isFetching }
      >
        {(provided, snapshot) => (
          <div>
            <div
              ref={ provided.innerRef }
              className={ `PlaylistItem ${clickedClassName} ${draggableClassName} ${snapshot.isDragging ? "isDragging" : ""}` }
              style={ provided.draggableStyle }
              { ...provided.dragHandleProps }
            >
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
            { provided.placeholder }
          </div>
        )}
      </Draggable>
    );
  }
}

const mapStateToPlaylistItemProps = (state) => {
  return {
    isFetching: state.searchResults.isFetching || state.playlist.isFetching > 0,
  };
};
const mapDispatchToPlaylistItemProps = (dispatch) => {
  return {
    removeItemFromPlaylist: index => dispatch(actions.removeFromPlaylistByIndex(index)),
  };
};
const ConnectedPlaylistItem = connect(mapStateToPlaylistItemProps, mapDispatchToPlaylistItemProps)(PlaylistItem);

class PlaylistTab extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    playlist: PropTypes.arrayOf(PropTypes.object),
    isFetchingPlaylist: PropTypes.bool,
  };

  render = () => {
    let content;
    if (this.props.playlist.length) {
      content = this.props.playlist.map((item, index) => (
        <div key={ item.id } className="PlaylistTab__PlaylistItemContainer">
          { index !== 0 && <hr className="PlaylistItemContainer__delimiter" /> }
          <ConnectedPlaylistItem
            item={ item }
            index={ index }
          />
        </div>
      ));
    } else {
      content = <div className="PlaylistTab__emptyNote">Playlist empty.</div>;
    }

    return (
      <Droppable droppableId="droppable-playlist" type="PLAYLIST_ITEM">
        {(provided, snapshot) => (
          <div
            ref={ provided.innerRef }
            className={ `PlaylistTab ${this.props.className || ""} ${snapshot.isDraggingOver ? "isDraggingOver" : ""}` }
          >
            { this.props.isFetchingPlaylist ? <Spinner /> : content }
            { provided.placeholder }
          </div>
        )}
      </Droppable>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    playlist: state.playlist.items,
    isFetchingPlaylist: state.playlist.isFetching > 0,
  };
};

export default connect(mapStateToProps)(PlaylistTab);
