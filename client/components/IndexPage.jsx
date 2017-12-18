import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "./store/Store";
import { withRouter, Link } from "react-router-dom";
import { compose } from "recompose";

import { Button } from "react-bootstrap";

class IndexPage extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    searchQuery: PropTypes.string,
    updateSearchQuery: PropTypes.func,
  };

  handleSearchChange = e => this.props.updateSearchQuery(e.target.value);
  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      this.props.history.push(`/search/${this.props.searchQuery}`);
    }
  }

  render = () => {
    return (
      <div>
        <h1>YouMuse</h1>
        <input
          placeholder="Search YouTube..."
          value={ this.props.searchQuery }
          onChange={ this.handleSearchChange }
          onKeyPress={ this.handleKeyPress }
        />
        <Button>
          <Link to={ `/search/${this.props.searchQuery}` }>Search</Link>
        </Button>
        <p>Subtitle</p>
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
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(IndexPage);
