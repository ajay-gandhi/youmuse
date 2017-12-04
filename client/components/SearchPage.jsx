import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "./store/Store";
import { Link } from "react-router-dom";

import { Button } from "react-bootstrap";

class SearchItem extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number,
    searchResult: PropTypes.object,
    addToPlayList: PropTypes.func,
  };

  handleClick = () => {
    this.props.addToPlayList(this.props.index);
  }

  render = () => {
    return (
      <div onClick={ this.handleClick } style={ { border: "1px solid blue" } }>
        <h2>{ this.props.searchResult.snippet.title }</h2>
        <h3>{ this.props.searchResult.snippet.channelTitle }</h3>
      </div>
    );
  }
}

class SearchPage extends React.Component {
  static propTypes = {
    searchQuery: PropTypes.string,
    searchResults: PropTypes.arrayOf(PropTypes.object),
    updateSearchQuery: PropTypes.func,
    getSearchResults: PropTypes.func,
    addItemToPlayList: PropTypes.func,
  };
  constructor(props) {
    super(props);
    if (props.searchQuery) {
      props.getSearchResults();
    }
  }

  handleSearchChange = e => this.props.updateSearchQuery(e.target.value)

  render = () => {
    const searchResults = this.props.searchResults.map((result, index) => (
      <SearchItem
        key={ result.id.videoId }
        searchResult={ result }
        index={ index }
        addToPlayList={ this.props.addItemToPlayList }
      />
    ));

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
          { searchResults }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    searchQuery: state.searchQuery,
    searchResults: state.searchResults.results,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateSearchQuery: searchQuery => dispatch(actions.setSearchQuery(searchQuery)),
    getSearchResults: () => dispatch(actions.getSearchResults()),
    addItemToPlayList: (index) => dispatch(actions.moveItemToPlaylist(index)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
// export default compose(
  // withRouter,
  // connect(mapStateToProps, mapDispatchToProps)
// )(SearchPage);
