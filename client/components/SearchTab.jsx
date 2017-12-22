import "./scss/SearchTab.scss";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { actions } from "./store/Store";

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
    const item = this.props.searchResult.snippet;
    return (
      <div className="SearchItem" onClick={ this.handleClick }>
        <div className="SearchItem__imageContainer">
          <img className="SearchItem__imageContainer__image" src={ item.thumbnails.default.url } />
        </div>
        <div className="SearchItem__textContent">
          <h3 className="SearchItem__textContent__heading">{ item.title }</h3>
          <h4 className="SearchItem__textContent__heading SearchItem__textContent__heading--channel">{ item.channelTitle }</h4>
        </div>
      </div>
    );
  }
}

class SearchTab extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    searchQuery: PropTypes.string,
    searchResults: PropTypes.arrayOf(PropTypes.object),
    fetchSearchResults: PropTypes.func,
    addItemToPlayList: PropTypes.func,
  };

  render = () => {
    const searchResults = this.props.searchResults.map((result, index) => (
      <div key={ result.id } className="SearchTab__SearchItemContainer">
        { index !== 0 && <hr className="SearchItemContainer__delimiter" /> }
        <SearchItem
          index={ index }
          searchResult={ result }
          addToPlayList={ this.props.addItemToPlayList }
        />
      </div>
    ));

    return (
      <div className={ `SearchTab ${this.props.className}` }>
        { searchResults }
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
    fetchSearchResults: () => dispatch(actions.fetchSearchResults()),
    addItemToPlayList: (index) => dispatch(actions.moveItemToPlaylist(index)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchTab);
