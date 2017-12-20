import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "./store/Store";

import AudioElement from "react-audio-player";
import { Button } from "react-bootstrap";

const mapStateToAudioElementProps = (state) => {
  const props = {
    controls: true,
  };
  if (state.currentSong) {
    props.src = state.currentSong.audio.url;
  }
  return props;
};
const ConnectedAudioElement = connect(mapStateToAudioElementProps)(AudioElement);

class Player extends React.Component {
  static propTypes = {
    handleNextClick: PropTypes.func,
    handlePreviousClick: PropTypes.func,
  };

  render = () => {
    return (
      <div>
        <Button onClick={ this.props.handlePreviousClick }>Previous</Button>
        <Button onClick={ this.handlePlayClick }>{ this.props.isPlaying ? "Pause" : "Play" }</Button>
        <Button onClick={ this.props.handleNextClick }>Next</Button>
        <ConnectedAudioElement />
      </div>
    );
  }
}

const mapStateToPlayerProps = (state) => {
  return {
  };
};
const mapDispatchToPlayerProps = (dispatch) => {
  return {
    handleNextClick: () => dispatch(actions.nextSong()),
    handlePreviousClick: () => dispatch(actions.nextSong()),
  };
};

const ConnectedPlayer = connect(mapStateToPlayerProps, mapDispatchToPlayerProps)(Player);
export default ConnectedPlayer;
