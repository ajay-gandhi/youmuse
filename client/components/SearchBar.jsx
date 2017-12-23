import "components/scss/SearchBar.scss";

import React from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { actions } from "components/store/Store";

import { Button } from "react-bootstrap";
import Icon from "components/Icon";

class SearchBar extends React.PureComponent {
  static propTypes = {
    history: PropTypes.object,
    className: PropTypes.string,
    searchQuery: PropTypes.string,
    updateSearchQuery: PropTypes.func,
  };

  handleSearchChange = e => this.props.updateSearchQuery(e.target.value)
  handleKeyPress = (e) => {
    if (e.key === "Enter") this.handleSearchClick();
  }
  handleSearchClick = () => {
    this.props.history.push(`/search/${this.props.searchQuery}`);
    this.props.fetchSearchResults();
  }

  render = () => {
    return (
      <div className={ `SearchBar ${this.props.className || ""}` }>
        <input
          className="SearchBar__input"
          placeholder="Search YouTube..."
          value={ this.props.searchQuery }
          onChange={ this.handleSearchChange }
          onKeyPress={ this.handleKeyPress }
        />
        <Button className="SearchBar__button BorderlessButton" onClick={ this.handleSearchClick }>
          <Icon glyph="search" />
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    searchQuery: state.searchQuery,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateSearchQuery: searchQuery => dispatch(actions.setSearchQuery(searchQuery)),
    fetchSearchResults: () => dispatch(actions.fetchSearchResults()),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SearchBar);
