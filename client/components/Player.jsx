import "components/scss/Player.scss";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "components/store/Store";
import { REPEAT_STATE } from "components/store/constants";

import ReactAudioPlayer from "react-audio-player";
import Icon from "components/Icon";
import Chevron from "components/Chevron";
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
    if (nextProps.volume !== this.props.volume) {
      this.audioElement.volume = nextProps.volume;
    }
  }

  handleListen = (e) => {
    this.setState({ currentTime: e });
    this.props.updateCurrentTime(e);
  }

  setAudioElement = ref => { this.audioElement = ref && ref.audioEl; }

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
    playlist: PropTypes.object,

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
    if (this.props.playlist.items.length === 0) return null;

    let maximizeButton;
    if (this.state.collapsed) {
      maximizeButton = (
        <Button className="Player__togglePlayerButton Player__togglePlayerButton--maximize" onClick={ this.handleTogglePlayer }>
          <Chevron up />
        </Button>
      );
    }

    const duration = this.props.currentSong ? this.props.currentSong.audio.duration : 0;
    const songTitle = this.props.currentSong ? this.props.currentSong.snippet.title : "";
    const channelTitle = this.props.currentSong ? `by ${this.props.currentSong.snippet.channelTitle}` : "";

    return (
      <div className={ `Player ${this.state.collapsed ? "Player--collapsed" : ""}` }>
        <div className="Player__controls">
          <input
            className="Player__controls__timeControl"
            type="range"
            min="0"
            max={ duration }
            step="1"
            value={ this.props.currentTime }
            onChange={ this.handleTimeChange }
          />
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
              className={ `OrderControl__button ${this.props.shuffle ? "OrderControl__button--enabled" : ""}` }
              onClick={ this.props.toggleShuffle }
            >
              <Icon glyph="shuffle" />
            </Button>
            <Button
              className={ `OrderControl__button ${this.props.repeat === REPEAT_STATE.off ? "" : "OrderControl__button--enabled"}` }
              onClick={ this.props.toggleRepeat }
            >
              <Icon glyph={ this.props.repeat === REPEAT_STATE.one ? "repeat_one" : "repeat" } />
            </Button>
          </div>
        </div>
        <div className="Player__metadata">
          <span className="Player__metadata__songTitle">{ songTitle }</span>
          <span className="Player__metadata__channelTitle">{ channelTitle }</span>
        </div>
        <ConnectedAudioElement />
        <Button className="Player__togglePlayerButton Player__togglePlayerButton--minimize" onClick={ this.handleTogglePlayer }>
          <Chevron />
        </Button>
        { maximizeButton }
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
    currentTime: state.currentTime,
    currentSong: state.currentSong,
    playlist: state.playlist,
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
