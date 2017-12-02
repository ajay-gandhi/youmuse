import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "./Store";
import { Link } from "react-router-dom";
// import { compose } from "recompose";

import { Button } from "react-bootstrap";

class IndexPage extends React.Component {
  static propTypes = {
    searchQuery: PropTypes.string,
    updateSearchQuery: PropTypes.func,
    // router: routerShape.isRequired,
  };

  handleSearchChange = e => this.props.updateSearchQuery(e.target.value);
  // onSearch = () => router.push("/search");

  render = () => {
    return (
      <div>
        <h1>YouMuse</h1>
        <input
          placeholder="Search YouTube..."
          value={ this.props.searchQuery }
          onChange={ this.handleSearchChange }
        />
        <Button>
          <Link to="/search">Search</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);
// export default compose(
  // withRouter,
  // connect(mapStateToProps, mapDispatchToProps)
// )(IndexPage);
