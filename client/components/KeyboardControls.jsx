import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "components/store/Store";

class KeyboardControls extends React.PureComponent {
  static propTypes = {
    volume: PropTypes.number, togglePlayback: PropTypes.func,
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
    const mapped = [" ", "arrowright", "arrowleft", "arrowup", "arrowdown", "r", "s", "m", "h"];
    if (!mapped.includes(e.key.toLowerCase())) return;
    if (e.altKey || e.metaKey || e.ctrlKey || e.shiftKey) return;

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
      case "h":          return this.handleHideImages();
    }
  }

  updateVolume = (volume) => {
    this.props.updateVolume(Math.round(volume * 100) / 100);
  }
  increaseVolume = () => {
    const newVolume = this.props.volume + 0.05;
    this.updateVolume(newVolume > 1 ? 1 : newVolume);
  }
  decreaseVolume = () => {
    const newVolume = this.props.volume - 0.05;
    this.updateVolume(newVolume < 0 ? 0 : newVolume);
  }
  handleMute = () => {
    if (this.props.volume === 0) {
      this.props.updateVolume((this.state && this.state.volume) || 1);
    } else {
      // Store for unmute
      this.setState({ prevVolume: this.props.volume });
      this.props.updateVolume(0);
    }
  }
  handleHideImages = () => {
    const root = document.getElementById("root");
    root.classList[root.classList.contains("imagesHidden") ? "remove" : "add"]("imagesHidden");
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
