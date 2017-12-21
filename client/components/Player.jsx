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
    volume: PropTypes.number,
    currentTime: PropTypes.number,
    setIsPlaying: PropTypes.func,
    nextSong: PropTypes.func,
    updateCurrentTime: PropTypes.func,
  };
  state = {
    currentTime: this.props.currentTime,
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

    if (nextProps.currentTime !== this.state.currentTime) {
      this.setState({ currentTime: nextProps.currentTime });
      this.audioElement.currentTime = nextProps.currentTime;
    }
  }

  handleListen = (e) => {
    this.setState({ currentTime: e });
    this.props.updateCurrentTime(e);
  }

  setAudioElement = (ref) => { this.audioElement = ref.audioEl; }

  render = () => {
    return (
      <ReactAudioPlayer
        listenInterval={ 900 }
        onListen={ this.handleListen }
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
    volume: state.volume,
    currentTime: state.currentTime,
  };
};
const mapDispatchToAudioElementProps = (dispatch) => {
  return {
    setIsPlaying: isPlaying => dispatch(actions.setIsPlaying(isPlaying)),
    nextSong: () => dispatch(actions.nextSong()),
    updateCurrentTime: currentTime => dispatch(actions.updateCurrentTime(currentTime)),
  };
};
const ConnectedAudioElement = connect(mapStateToAudioElementProps, mapDispatchToAudioElementProps)(AudioElement);

class Player extends React.Component {
  static propTypes = {
    isPlaying: PropTypes.bool,
    shuffle: PropTypes.bool,
    repeat: PropTypes.number,
    volume: PropTypes.number,
    duration: PropTypes.number,
    currentTime: PropTypes.number,

    handleTogglePlay: PropTypes.func,
    handleNextClick: PropTypes.func,
    handlePreviousClick: PropTypes.func,
    toggleShuffle: PropTypes.func,
    toggleRepeat: PropTypes.func,
    updateVolume: PropTypes.func,
    updateCurrentTime: PropTypes.func,
  };

  handleVolumeChange = (e) => {
    this.props.updateVolume(parseFloat(e.target.value));
  }
  handleTimeChange = (e) => {
    this.props.updateCurrentTime(parseInt(e.target.value));
  }

  render = () => {
    return (
      <div>
        <Button onClick={ this.props.handlePreviousClick }>Previous</Button>
        <Button onClick={ this.props.handleTogglePlay }>{ this.props.isPlaying ? "Pause" : "Play" }</Button>
        <Button onClick={ this.props.handleNextClick }>Next</Button>
        <Button onClick={ this.props.toggleShuffle }>Shuffle is { this.props.shuffle ? "on" : "off" }</Button>
        <Button onClick={ this.props.toggleRepeat }>Repeat is { this.props.repeat }</Button>
        <ConnectedAudioElement />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={ this.props.volume }
          onChange={ this.handleVolumeChange }
        />
        <input
          type="range"
          min="0"
          max={ this.props.duration }
          step="1"
          value={ this.props.currentTime }
          onChange={ this.handleTimeChange }
        />
      </div>
    );
  }
}

const mapStateToPlayerProps = (state) => {
  return {
    isPlaying: state.isPlaying,
    shuffle: state.shuffle,
    repeat: state.repeat,
    volume: state.volume,
    duration: state.currentSong ? state.currentSong.audio.duration : 1,
    currentTime: state.currentTime,
  };
};
const mapDispatchToPlayerProps = (dispatch) => {
  return {
    handleTogglePlay: () => dispatch(actions.setIsPlaying()),
    handleNextClick: () => dispatch(actions.nextSong()),
    handlePreviousClick: () => dispatch(actions.previousSong()),
    toggleShuffle: () => dispatch(actions.toggleShuffle()),
    toggleRepeat: () => dispatch(actions.toggleRepeat()),
    updateVolume: volume => dispatch(actions.updateVolume(volume)),
    updateCurrentTime: currentTime => dispatch(actions.updateCurrentTime(currentTime)),
  };
};

const ConnectedPlayer = connect(mapStateToPlayerProps, mapDispatchToPlayerProps)(Player);
export default ConnectedPlayer;
