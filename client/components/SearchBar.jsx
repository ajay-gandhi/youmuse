import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "./Store";

class SearchBar extends React.Component {
  static propTypes = {
    searchQuery: PropTypes.string,
    updateSearchQuery: PropTypes.func,
  };

  handleSearchChange = e => this.props.updateSearchQuery(e.target.value);

  render = () => {
    return (
      <input
        placeholder="Search YouTube..."
        value={ this.props.searchQuery }
        onChange={ this.handleSearchChange }
      />
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
