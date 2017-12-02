import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "./Store";
import { Link } from "react-router-dom";

import { Button } from "react-bootstrap";

class SearchPage extends React.Component {
  static propTypes = {
    searchQuery: PropTypes.string,
    updateSearchQuery: PropTypes.func,
    getSearchResults: PropTypes.func,
  };
  constructor(props) {
    super(props);
    if (props.searchQuery) {
      props.getSearchResults();
    }
  }

  handleSearchChange = e => this.props.updateSearchQuery(e.target.value)

  render = () => {
    return (
      <div>
        <h1>YouMuse Search</h1>
        <input
          placeholder="Search YouTube..."
          value={ this.props.searchQuery }
          onChange={ this.handleSearchChange }
        />
        <Button>
          <Link to={ `/search/${this.props.searchQuery}` }>Search</Link>
        </Button>
        <div className="searchResults">
        </div>
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
    getSearchResults: () => {},
    // getSearchResults: () => dispatch(actions.getSearchResults()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
// export default compose(
  // withRouter,
  // connect(mapStateToProps, mapDispatchToProps)
// )(SearchPage);
