import React from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { connect } from "react-redux";
import { actions } from "./store/Store";
import { withRouter, Link } from "react-router-dom";

import SearchTab from "./SearchTab";
import PlaylistTab from "./PlaylistTab";
import { Button, Nav, NavItem } from "react-bootstrap";

class PlayerPage extends React.Component {
  static propTypes = {
    activeTabIndex: PropTypes.number,
    searchQuery: PropTypes.string,
    updateSearchQuery: PropTypes.func,
    history: PropTypes.object,
  };

  handleSearchChange = e => this.props.updateSearchQuery(e.target.value)
  handleTabClick = (tab) => {
    if (tab === 1) {
      this.props.history.push(`/search/${this.props.searchQuery}`);
    } else {
      this.props.history.push("/playlist");
    }
  }


  render = () => {
    const currentTab = this.props.activeTabIndex === 1 ? <SearchTab /> : <PlaylistTab />;
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
        <Nav bsStyle="tabs" activeKey={ this.props.activeTabIndex } onSelect={ this.handleTabClick }>
          <NavItem eventKey={ 1 }>Search</NavItem>
          <NavItem eventKey={ 2 }>Playlist</NavItem>
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

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(PlayerPage);
