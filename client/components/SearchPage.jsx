import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "./Store";
import { Link } from "react-router-dom";
// import { compose } from "recompose";

import { Button } from "react-bootstrap";

class SearchPage extends React.Component {
  static propTypes = {
    searchQuery: PropTypes.string,
    updateSearchQuery: PropTypes.func,
    // router: routerShape.isRequired,
  };
  constructor(props) {
    super(props);
  }

  handleSearchChange = e => this.props.updateSearchQuery(e.target.value)
  // onSearch = () => router.push("/search");

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
          <Link to="/search">Search</Link>
        </Button>
        <div className="searchResults">
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    searchQuery: ownProps.match.searchQuery,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateSearchQuery: searchQuery => dispatch(actions.setSearchQuery(searchQuery)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
// export default compose(
  // withRouter,
  // connect(mapStateToProps, mapDispatchToProps)
// )(SearchPage);
