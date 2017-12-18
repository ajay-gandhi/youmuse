/* global gapi */
import fetch from "cross-fetch";
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
const updatePlaylist = (playlist) => {
  return {
    type: ACTION_TYPES.updatePlaylist,
    playlist,
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
const moveItemToPlaylist = (index) => {
  return (dispatch, getState) => {
    const newItem = getState().searchResults.results[index];
    const newSearchResults = getState().searchResults.results.slice();
    newSearchResults.splice(index, 1);
    dispatch(updateSearchResults(newSearchResults));

    return fetch(`http://localhost:8000/getAudioUrl?videoId=${newItem.id.videoId}`).then(
      response => response.json(),
      error => console.log("Error fetching audio", error)
    ).then((json) => {
      newItem.audio = {
        duration: json.duration,
        url: json.url,
      };
      dispatch(updatePlaylist(getState().playlist.concat(newItem)));
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
