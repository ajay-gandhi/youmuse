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
    nextSong: PropTypes.func,
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
    return (
      <ReactAudioPlayer
        ref={ this.setAudioElement }
        onEnded={ this.props.nextSong }
        src={ this.props.src || "" }
        controls={ true }
      />
    );
  }
}
const mapStateToAudioElementProps = (state) => {
  return {
    isPlaying: state.isPlaying,
    src: state.currentSong ? state.currentSong.audio.url : null,
  };
};
const mapDispatchToAudioElementProps = (dispatch) => {
  return {
    setIsPlaying: isPlaying => dispatch(actions.setIsPlaying(isPlaying)),
    nextSong: () => dispatch(actions.nextSong()),
  };
};
const ConnectedAudioElement = connect(mapStateToAudioElementProps, mapDispatchToAudioElementProps)(AudioElement);

class Player extends React.Component {
  static propTypes = {
    isPlaying: PropTypes.bool,
    shuffle: PropTypes.bool,
    repeat: PropTypes.number,

    handleTogglePlay: PropTypes.func,
    handleNextClick: PropTypes.func,
    handlePreviousClick: PropTypes.func,
    toggleShuffle: PropTypes.func,
    toggleRepeat: PropTypes.func,
  };

  render = () => {
    return (
      <div>
        <Button onClick={ this.props.handlePreviousClick }>Previous</Button>
        <Button onClick={ this.props.handleTogglePlay }>{ this.props.isPlaying ? "Pause" : "Play" }</Button>
        <Button onClick={ this.props.handleNextClick }>Next</Button>
        <Button onClick={ this.props.toggleShuffle }>Shuffle is { this.props.shuffle ? "on" : "off" }</Button>
        <Button onClick={ this.props.toggleRepeat }>Repeat is { this.props.repeat }</Button>
        <ConnectedAudioElement />
      </div>
    );
  }
}

const mapStateToPlayerProps = (state) => {
  return {
    isPlaying: state.isPlaying,
    shuffle: state.shuffle,
    repeat: state.repeat,
  };
};
const mapDispatchToPlayerProps = (dispatch) => {
  return {
    handleTogglePlay: () => dispatch(actions.setIsPlaying()),
    handleNextClick: () => dispatch(actions.nextSong()),
    handlePreviousClick: () => dispatch(actions.previousSong()),
    toggleShuffle: () => dispatch(actions.toggleShuffle()),
    toggleRepeat: () => dispatch(actions.toggleRepeat()),
  };
};

const ConnectedPlayer = connect(mapStateToPlayerProps, mapDispatchToPlayerProps)(Player);
export default ConnectedPlayer;
