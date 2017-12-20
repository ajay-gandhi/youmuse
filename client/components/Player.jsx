import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "./store/Store";

import ReactAudioPlayer from "react-audio-player";
import { Button } from "react-bootstrap";

class AudioElement extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    isPlaying: PropTypes.bool,
    setIsPlaying: PropTypes.func,
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.props.isPlaying && !nextProps.isPlaying) {
      this.audioElement.pause();
      this.props.setIsPlaying(false);
    } else if (!this.props.isPlaying && nextProps.isPlaying) {
      this.audioElement.play().then(
        () => this.props.setIsPlaying(true),
        () => this.props.setIsPlaying(false)
      );
    }
  }

  setAudioElement = (ref) => { this.audioElement = ref.audioEl; }

  render = () => {
    return <ReactAudioPlayer ref={ this.setAudioElement } { ...this.props } />;
  }
}
const mapStateToAudioElementProps = (state) => {
  const props = {
    controls: true,
    isPlaying: state.isPlaying,
  };
  if (state.currentSong) {
    props.src = state.currentSong.audio.url;
  }
  return props;
};
const mapDispatchToAudioElementProps = (dispatch) => {
  return {
    setIsPlaying: isPlaying => dispatch(actions.setIsPlaying(isPlaying)),
  };
};
const ConnectedAudioElement = connect(mapStateToAudioElementProps, mapDispatchToAudioElementProps)(AudioElement);

class Player extends React.Component {
  static propTypes = {
    isPlaying: PropTypes.bool,
    handleTogglePlay: PropTypes.func,
    handleNextClick: PropTypes.func,
    handlePreviousClick: PropTypes.func,
  };

  render = () => {
    return (
      <div>
        <Button onClick={ this.props.handlePreviousClick }>Previous</Button>
        <Button onClick={ this.props.handleTogglePlay }>{ this.props.isPlaying ? "Pause" : "Play" }</Button>
        <Button onClick={ this.props.handleNextClick }>Next</Button>
        <ConnectedAudioElement />
      </div>
    );
  }
}

const mapStateToPlayerProps = (state) => {
  return {
    isPlaying: state.isPlaying,
  };
};
const mapDispatchToPlayerProps = (dispatch) => {
  return {
    handleTogglePlay: () => dispatch(actions.setIsPlaying()),
    handleNextClick: () => dispatch(actions.nextSong()),
    handlePreviousClick: () => dispatch(actions.previousSong()),
  };
};

const ConnectedPlayer = connect(mapStateToPlayerProps, mapDispatchToPlayerProps)(Player);
export default ConnectedPlayer;
