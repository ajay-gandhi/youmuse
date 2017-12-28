import "components/scss/Queue.scss";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "components/store/Store";
import { MAX_QUEUE_SIZE } from "components/store/constants";

import { Draggable, Droppable } from "react-beautiful-dnd";

import Icon from "./Icon";
import { Button } from "react-bootstrap";

const formatAudio = (seconds) => {
  let result = seconds % 60;
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60) % 60;
    result = `${m < 10 ? `0${m}` : m}:${result}`;
  }
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600) % 24;
    result = `${h < 10 ? `0${h}` : h}:${result}`;
  }
  if (seconds >= 86400) {
    const d = Math.floor(seconds / 86400);
    result = `${d}d, ${result}`;
  }
  result = result.charAt(0) === "0" ? result.slice(1) : result;
  return result;
};

class QueueItem extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    index: PropTypes.number,
    item: PropTypes.object,
    isFetching: PropTypes.bool,
    removeFromQueueByIndex: PropTypes.func,
  };
  state = {
    clicked: false,
  };

  handleRemoveClick = () => {
    this.setState({ clicked: true });
    setTimeout(() => this.props.removeFromQueue(this.props.index), 200);
  }

  render = () => {
    const clickedClassName = this.state.clicked ? "QueueItem--clicked" : "";
    const draggableClassName = this.props.isFetching ? "" : "isDraggable";
    return (
      <Draggable
        draggableId={ `draggable-queueItem-${this.props.item.id}` }
        type="QUEUE_ITEM"
        isDragDisabled={ this.props.isFetching }
      >
        {(provided, snapshot) => (
          <div>
            <div
              ref={ provided.innerRef }
              className={ `QueueItem ${clickedClassName} ${draggableClassName} ${snapshot.isDragging ? "isDragging" : ""}` }
              style={ provided.draggableStyle }
              { ...provided.dragHandleProps }
            >
              <div className="QueueItem__imageContainer">
                <img className="QueueItem__image" src={ this.props.item.snippet.thumbnails.default.url } />
              </div>
              <div className="QueueItem__textContent">
                <h4 className="QueueItem__textContent__heading">{ this.props.item.snippet.title }</h4>
                <h5 className="QueueItem__textContent__heading QueueItem__textContent__heading--subtitle">{ formatAudio(this.props.item.audio.duration) } - { this.props.item.snippet.title }</h5>
              </div>
              <Button className="QueueItem__removeButton BorderlessButton" onClick={ this.handleRemoveClick }>
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

const mapStateToQueueItemProps = (state) => {
  return {
    isFetching: state.searchResults.isFetching || state.playlist.isFetching > 0,
  };
};
const mapDispatchToQueueItemProps = (dispatch) => {
  return {
    removeFromQueueByIndex: index => dispatch(actions.removeFromQueueByIndex(index)),
  };
};
const ConnectedQueueItem = connect(mapStateToQueueItemProps, mapDispatchToQueueItemProps)(QueueItem);

class Queue extends React.Component {
  static propTypes = {
    queue: PropTypes.arrayOf(PropTypes.object),
    playlist: PropTypes.arrayOf(PropTypes.object),
  };

  render = () => {
    let queueContent;
    if (this.props.queue.length > 0) {
      queueContent = this.props.queue.map((item, index) => (
        <ConnectedQueueItem
          key={ `${item.id}-${index}` }
          item={ item }
          index={ index }
        />
      ));
    } else {
      queueContent = <div className="Queue__emptyNote">Queue empty.</div>;
    }

    const hiddenClassName = this.props.playlist.length === 0 ? "Queue-invisible" : "";
    return (
      <Droppable droppableId="droppable-queue" type="QUEUE_ITEM">
        {(provided, snapshot) => (
          <div
            ref={ provided.innerRef }
            className={ `Queue ${this.props.className || ""} ${hiddenClassName} ${snapshot.isDraggingOver ? "isDraggingOver" : ""}` }
          >
            <h2 className="Queue__heading">queue</h2>
            { queueContent }
            { provided.placeholder }
          </div>
        )}
      </Droppable>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    queue: state.queue.slice(0, MAX_QUEUE_SIZE),
    playlist: state.playlist.items,
  };
};

export default connect(mapStateToProps)(Queue);
