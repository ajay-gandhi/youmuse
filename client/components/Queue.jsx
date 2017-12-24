import "components/scss/Queue.scss";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "components/store/Store";

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
    removeFromQueue: PropTypes.func,
  };
  state = {
    clicked: false,
  };

  handleRemoveClick = () => {
    this.setState({ clicked: true });
    setTimeout(() => this.props.removeFromQueue(this.props.index), 200);
  }

  render = () => {
    return (
      <div className={ `QueueItem ${this.state.clicked ? "QueueItem--clicked" : ""}` }>
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
    );
  }
}

class Queue extends React.Component {
  static propTypes = {
    queue: PropTypes.arrayOf(PropTypes.object),
    removeFromQueue: PropTypes.func,
  };

  render = () => {
    if (this.props.queue.length === 0) return null;

    const queue = this.props.queue.map((item, index) => (
      <QueueItem
        key={ `${item.id}-${index}` }
        item={ item }
        index={ index }
        removeFromQueue={ this.props.removeFromQueue }
      />
    ));

    return (
      <div className={ `Queue ${this.props.className}` }>
        { queue }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    queue: state.queue,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    removeFromQueue: index => dispatch(actions.removeFromQueue(index)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Queue);
