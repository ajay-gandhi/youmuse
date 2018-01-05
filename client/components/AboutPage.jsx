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
        <dl className="AboutPage__content__features">
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
      </div>
    </div>
  );
}

export default withRouter(AboutPage);
