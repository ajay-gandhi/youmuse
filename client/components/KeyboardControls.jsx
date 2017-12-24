import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "components/store/Store";

class KeyboardControls extends React.Component {
  static propTypes = {
    volume: PropTypes.number,

    togglePlayback: PropTypes.func,
    nextSong: PropTypes.func,
    previousSong: PropTypes.func,
    toggleShuffle: PropTypes.func,
    toggleRepeat: PropTypes.func,
    updateVolume: PropTypes.func,
  };

  componentWillMount = () => {
    window.addEventListener("keydown", this.performKeyAction);
  }
  componentWillUnmount = () => {
    window.removeEventListener("keydown", this.performKeyAction);
  }

  performKeyAction = (e) => {
    if (e.target.tagName.toLowerCase() === "input" && e.target.type === "text") return;
    const mapped = [" ", "arrowright", "arrowleft", "arrowup", "arrowdown", "r", "s", "m"];
    if (!mapped.includes(e.key.toLowerCase())) return;

    e.preventDefault();
    switch (e.key.toLowerCase()) {
      case " ":          return this.props.togglePlayback();
      case "arrowright": return this.props.nextSong();
      case "arrowleft":  return this.props.previousSong();
      case "arrowup":    return this.increaseVolume();
      case "arrowdown":  return this.decreaseVolume();
      case "r":          return this.props.toggleRepeat();
      case "s":          return this.props.toggleShuffle();
      case "m":          return this.handleMute();
    }
  }

  increaseVolume = () => {
    const newVolume = this.props.volume + 0.05;
    this.props.updateVolume(newVolume > 1 ? 1 : newVolume);
  }
  decreaseVolume = () => {
    const newVolume = this.props.volume - 0.05;
    this.props.updateVolume(newVolume < 0 ? 0 : newVolume);
  }
  handleMute = () => {
    // Store for unmute
    if (this.props.volume === 0) {
      this.props.updateVolume((this.state && this.state.volume) || 1);
    } else {
      this.setState({ prevVolume: this.props.volume });
      this.props.updateVolume(0);
    }
  }

  render = () => {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    volume: state.volume,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    togglePlayback: () => dispatch(actions.setIsPlaying()),
    nextSong: () => dispatch(actions.nextSong()),
    previousSong: () => dispatch(actions.previousSong()),
    toggleShuffle: () => dispatch(actions.toggleShuffle()),
    toggleRepeat: () => dispatch(actions.toggleRepeat()),
    updateVolume: volume => dispatch(actions.updateVolume(volume)),
  };
};

const ConnectedKeyboardControls = connect(mapStateToProps, mapDispatchToProps)(KeyboardControls);
export default ConnectedKeyboardControls;
