import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "./store/Store";

class QueueItem extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number,
    searchResult: PropTypes.object,
    removeFromQueue: PropTypes.func,
  };

  handleRemoveClick = () => {
    this.props.removeFromQueue(this.props.index);
  }

  render = () => {
    return (
      <div style={ { border: "1px solid green" } }>
        <h4>{ this.props.searchResult.snippet.title }</h4>
        <span onClick={ this.handleRemoveClick }>Remove from queue</span>
      </div>
    );
  }
}

class Queue extends React.Component {
  static propTypes = {
    queue: PropTypes.arrayOf(PropTypes.object),
  };

  render = () => {
    const queue = this.props.queue.map((item, index) => (
      <QueueItem
        key={ item.id.videoId }
        searchResult={ item }
        index={ index }
      />
    ));

    return (
      <div className="Queue">
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
    addItemToPlayList: (index) => dispatch(actions.moveItemToPlaylist(index)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Queue);
