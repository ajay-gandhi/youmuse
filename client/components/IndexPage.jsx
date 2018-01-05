import "components/scss/IndexPage.scss";

import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import SearchBar from "components/SearchBar";

class IndexPage extends React.PureComponent {
  static propTypes = {
    history: PropTypes.object,
  };

  goToAbout = () => this.props.history.push("/about");

  render = () => (
    <div className="IndexPage">
      <h1 className="IndexPage__heading">YouMuse</h1>
      <div className="IndexPage__content">
        <SearchBar className="IndexPage__content__SearchBar" autoFocus />
        <h3 className="IndexPage__content__subtitle">
          Listen to YouTube, ad-free
          <a onClick={ this.goToAbout } className="IndexPage__content__subtitle__about">?</a>
        </h3>
      </div>
    </div>
  );
}

export default withRouter(IndexPage);
