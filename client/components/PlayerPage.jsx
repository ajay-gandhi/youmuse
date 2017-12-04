import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "./store/Store";
import { Link } from "react-router-dom";

import SearchTab from "./SearchTab";
import { Button, Nav, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

class PlayerPage extends React.Component {
  static propTypes = {
    activeTabIndex: PropTypes.number,
    searchQuery: PropTypes.string,
    updateSearchQuery: PropTypes.func,
  };

  handleSearchChange = e => this.props.updateSearchQuery(e.target.value)

  render = () => {
    const currentTab = this.props.activeTabIndex === 1 ? <SearchTab /> : <div />;
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
        <Nav bsStyle="tabs" activeKey={ this.props.activeTabIndex }>
          <LinkContainer to={ `/search/${this.props.searchQuery}` }>
            <NavItem eventKey={ 1 }>Search</NavItem>
          </LinkContainer>
          <LinkContainer to="/playlist">
            <NavItem eventKey={ 2 }>Playlist</NavItem>
          </LinkContainer>
        </Nav>
        { currentTab }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    activeTabIndex: state.activeTabIndex,
    searchQuery: state.searchQuery || "",
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateSearchQuery: searchQuery => dispatch(actions.setSearchQuery(searchQuery)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerPage);
