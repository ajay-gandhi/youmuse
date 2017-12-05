/* global gapi */
import { ACTION_TYPES } from "./constants";

/** Sync actions **/
const setSearchQuery = (searchQuery) => {
  return {
    type: ACTION_TYPES.setSearchQuery,
    searchQuery,
  };
};
const toggleRepeat = () => {
  return { type: ACTION_TYPES.toggleRepeat };
};
const toggleShuffle = () => {
  return { type: ACTION_TYPES.toggleShuffle };
};
const moveItemToPlaylist = (index) => {
  return {
    type: ACTION_TYPES.moveToPlaylist,
    index,
  };
};
const removeItemFromPlaylist = (index) => {
  return {
    type: ACTION_TYPES.removeItemFromPlaylist,
    index,
  };
};

const mergeState = (newState) => {
  return {
    type: ACTION_TYPES.mergeState,
    newState,
  };
};

/** Sync actions for use by async actions **/
const requestSearchResults = () => {
  return mergeState({
    searchResults: {
      isFetching: true,
      results: [],
    },
  });
};
const updateSearchResults = (data) => {
  return mergeState({
    searchResults: {
      isFetching: false,
      results: data,
    },
  });
};

/** Async actions **/
const getSearchResults = () => {
  return (dispatch, getState) => {
    dispatch(requestSearchResults());
    // const searchQuery = getState().searchQuery;
    return gapi.client.request({
      "path": "https://www.googleapis.com/youtube/v3/search",
      "params": {
        "part": "snippet",
        "q": getState().searchQuery,
        "maxResults": 10,
        "type": "vide",
      },
    }).then((response) => {
      dispatch(updateSearchResults(response.result.items));
    }, (reason) => {
      console.error(reason);
    });
  };
};

const actions = {
  // Sync
  setSearchQuery,
  toggleRepeat,
  toggleShuffle,
  mergeState,
  moveItemToPlaylist,
  removeItemFromPlaylist,

  // Async
  getSearchResults,
};
export default actions;
