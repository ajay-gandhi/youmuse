import "components/scss/AboutPage.scss";

import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { Button } from "react-bootstrap";

class AboutPage extends React.PureComponent {
  static propTypes = {
    history: PropTypes.object,
  };

  goToIndex = () => this.props.history.push("/");

  render = () => (
    <div className="AboutPage">
      <h1 className="AboutPage__heading">About YouMuse</h1>
      <div className="AboutPage__content">
        YouMuse is a music player that streams audio directly from YouTube.
        <dl className="AboutPage__content__list">
          <dt>Free</dt>
          <dd>No ads</dd>
          <dt>Fast</dt>
          <dd>Stream from YouTube servers</dd>
          <dt>Efficient</dt>
          <dd>Stream only audio</dd>
          <dt>Convenient</dt>
          <dd>Create and save playlists, no account required</dd>
          <dt>Fully-featured</dt>
          <dd>Complete audio playback control</dd>
        </dl>
        <Button className="AboutPage__content__index" onClick={ this.goToIndex }>Cool!</Button>
        <h3 className="AboutPage__content__keyboardControlsHeading">Keyboard Controls</h3>
        <dl className="AboutPage__content__list AboutPage__content__list--keyboardControls">
          <dt>spacebar</dt>
          <dd>Play/pause</dd>
          <dt>right arrow</dt>
          <dd>Next song</dd>
          <dt>left arrow</dt>
          <dd>previous song</dd>
          <dt>up</dt>
          <dd>Increase volume</dd>
          <dt>down</dt>
          <dd>Decrease volume</dd>
          <dt>s</dt>
          <dd>Toggle shuffle</dd>
          <dt>r</dt>
          <dd>Toggle repeat</dd>
          <dt>m</dt>
          <dd>Mute/unmute</dd>
        </dl>
      </div>
    </div>
  );
}

export default withRouter(AboutPage);
