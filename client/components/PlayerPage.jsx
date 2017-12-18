import React from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { connect } from "react-redux";
import { actions } from "./store/Store";
import { withRouter, Link } from "react-router-dom";

import SearchTab from "./SearchTab";
import PlaylistTab from "./PlaylistTab";
import { Button, Tabs, Tab} from "react-bootstrap";

class PlayerPage extends React.Component {
  static propTypes = {
    activeTabIndex: PropTypes.number,
    searchQuery: PropTypes.string,
    updateSearchQuery: PropTypes.func,
    history: PropTypes.object,
  };

  handleSearchChange = e => this.props.updateSearchQuery(e.target.value)
  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      this.props.history.push(`/search/${this.props.searchQuery}`);
    }
  }
  handleTabClick = (tab) => {
    // const route = tab === 1 ? `/search/${this.props.searchQuery}` : "/playlist";
    // this.props.history.push(route);
  }


  render = () => {
    return (
      <div>
        <h1>YouMuse Search</h1>
        <input
          placeholder="Search YouTube..."
          value={ this.props.searchQuery }
          onChange={ this.handleSearchChange }
          onKeyPress={ this.handleKeyPress }
        />
        <Button>
          <Link to={ `/search/${this.props.searchQuery}` }>Search</Link>
        </Button>
        <Tabs activeKey={ this.props.page } onSelect={ this.handleTabClick } id="PlayerNavigation">
          <Tab eventKey="search" title="Search">
            <SearchTab />
          </Tab>
          <Tab eventKey="playlist" title="Playlist">
            <PlaylistTab />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // activeTabIndex: state.activeTabIndex,
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
