import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "./Store";

import { Button } from "react-bootstrap";

class SearchBar extends React.Component {
  static propTypes = {
    searchQuery: PropTypes.string,
    updateSearchQuery: PropTypes.func,
  };

  handleSearchChange = e => this.props.updateSearchQuery(e.target.value);
  onSearch = () => console.log("Going to search", this.props.searchQuery);

  render = () => {
    return (
      <div>
        <input
          placeholder="Search YouTube..."
          value={ this.props.searchQuery }
          onChange={ this.handleSearchChange }
        />
        <Button onClick={ this.props.onSearch }>Search</Button>
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

const ConnectedSearchBar = connect(mapStateToProps, mapDispatchToProps)(SearchBar);
export default ConnectedSearchBar;
