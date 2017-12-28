import "components/scss/SearchTab.scss";

import React from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { connect } from "react-redux";
import { actions } from "components/store/Store";
import { withRouter } from "react-router-dom";

import Spinner from "components/Spinner";

class SearchItem extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number,
    searchResult: PropTypes.object,
    addItemToPlaylist: PropTypes.func,
    removeFromSearchResults: PropTypes.func,
  };
  state = {
    clicked: false,
  };

  handleClick = () => {
    this.setState({ clicked: true });
    this.props.addItemToPlaylist(this.props.searchResult);
    setTimeout(() => this.props.removeFromSearchResults(this.props.index), 300);
  }

  render = () => {
    const item = this.props.searchResult.snippet;
    return (
      <div className={ `SearchItem ${this.state.clicked ? "SearchItem--clicked" : ""}` } onClick={ this.handleClick }>
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

const mapStateToSearchItemProps = () => ({});
const mapDispatchToSearchItemProps = (dispatch) => {
  return {
    removeFromSearchResults: index => dispatch(actions.removeFromSearchResults(index)),
    addItemToPlaylist: item => dispatch(actions.addItemToPlaylist(item)),
  };
};
const ConnectedSearchItem = connect(mapStateToSearchItemProps, mapDispatchToSearchItemProps)(SearchItem);

class SearchTab extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    searchQuery: PropTypes.string,
    searchResults: PropTypes.arrayOf(PropTypes.object),
    isFetchingSearchResults: PropTypes.bool,
    match: PropTypes.object,
  };

  render = () => {
    let content;
    if (this.props.searchResults.length) {
      content = this.props.searchResults.map((result, index) => (
        <div key={ result.id } className="SearchTab__SearchItemContainer">
          { index !== 0 && <hr className="SearchItemContainer__delimiter" /> }
          <ConnectedSearchItem
            index={ index }
            searchResult={ result }
          />
        </div>
      ));
    } else if (this.props.searchQuery && this.props.searchQuery === this.props.match.params.searchQuery) {
      content = <div className="SearchTab__emptyNote">No results</div>;
    } else {
      content = <div className="SearchTab__emptyNote">Enter search keywords above.</div>;
    }

    return (
      <div className={ `SearchTab ${this.props.className}` }>
        { this.props.isFetchingSearchResults ? <Spinner /> : content }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    searchQuery: state.searchQuery,
    searchResults: state.searchResults.results,
    isFetchingSearchResults: state.searchResults.isFetching,
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps)
)(SearchTab);
