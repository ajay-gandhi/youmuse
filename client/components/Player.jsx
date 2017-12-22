import "./scss/Player.scss";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "./store/Store";
import { REPEAT_STATE } from "./store/Constants";

import ReactAudioPlayer from "react-audio-player";
import Icon from "./Icon";
import Chevron from "./Chevron";
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
    currentSong: PropTypes.object,
    currentTime: PropTypes.number,

    handleTogglePlay: PropTypes.func,
    handleNextClick: PropTypes.func,
    handlePreviousClick: PropTypes.func,
    toggleShuffle: PropTypes.func,
    toggleRepeat: PropTypes.func,
    updateVolume: PropTypes.func,
    updateCurrentTime: PropTypes.func,
  };
  state = {
    collapsed: false,
  };

  handleTogglePlayer = () => {
    this.setState({ collapsed: !this.state.collapsed });
  }
  handleVolumeChange = (e) => {
    this.props.updateVolume(parseFloat(e.target.value));
  }
  handleTimeChange = (e) => {
    this.props.updateCurrentTime(parseInt(e.target.value));
  }

  render = () => {
    if (!this.props.currentSong) return null;

    let maximizeButton;
    if (this.state.collapsed) {
      maximizeButton = (
        <Button className="Player__togglePlayerButton Player__togglePlayerButton--maximize" onClick={ this.handleTogglePlayer }>
          <Chevron up />
        </Button>
      );
    }

    return (
      <div className={ `Player ${this.state.collapsed ? "Player--collapsed" : ""}` }>
        <div className="Player__controls">
          <input
            className="Player__controls__volumeControl"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={ this.props.volume }
            onChange={ this.handleVolumeChange }
          />
          <div className="Player__controls__PlaybackControl">
            <Button className="PlaybackControl__button PlaybackControl__button--skip"
              onClick={ this.props.handlePreviousClick }
            >
              <Icon glyph="skip_previous" />
            </Button>
            <Button
              className="PlaybackControl__button PlaybackControl__button--togglePlayback"
              onClick={ this.props.handleTogglePlay }
            >
              <Icon glyph={ this.props.isPlaying ? "pause" : "play_arrow" } />
            </Button>
            <Button
              className="PlaybackControl__button PlaybackControl__button--skip"
              onClick={ this.props.handleNextClick }
            >
              <Icon glyph="skip_next" />
            </Button>
          </div>
          <div className="Player__controls__OrderControl">
            <Button
              className="OrderControl__button"
              onClick={ this.props.toggleShuffle }
            >
              <Icon glyph="shuffle" />
            </Button>
            <Button
              className="OrderControl__button"
              onClick={ this.props.toggleRepeat }
            >
              <Icon glyph={ this.props.repeat === REPEAT_STATE.one ? "repeat_one" : "repeat" } />
            </Button>
          </div>
        </div>
        <div className="Player__metadata">
          <span className="Player__metadata__songTitle">{ this.props.currentSong.snippet.title }</span>
          <span className="Player__metadata__channelTitle">by { this.props.currentSong.snippet.channelTitle }</span>
        </div>
        <ConnectedAudioElement />
        <Button className="Player__togglePlayerButton Player__togglePlayerButton--minimize" onClick={ this.handleTogglePlayer }>
          <Chevron />
        </Button>
        { maximizeButton }
      </div>
    );
    // <input
    // type="range"
    // min="0"
    // max={ this.props.currentSong.audio.duration }
    // step="1"
    // value={ this.props.currentTime }
    // onChange={ this.handleTimeChange }
        // />
  }
}

const mapStateToPlayerProps = (state) => {
  return {
    isPlaying: state.isPlaying,
    shuffle: state.shuffle,
    repeat: state.repeat,
    volume: state.volume,
    currentTime: state.currentTime,
    currentSong: state.currentSong,
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
