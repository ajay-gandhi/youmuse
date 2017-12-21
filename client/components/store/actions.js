/* global gapi */
import fetch from "cross-fetch";
import { ACTION_TYPES } from "./Constants";

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
const updateVolume = (volume) => {
  return {
    type: ACTION_TYPES.updateVolume,
    volume,
  };
};
const updateCurrentTime = (currentTime) => {
  return {
    type: ACTION_TYPES.updateCurrentTime,
    currentTime,
  };
};
const removeItemFromPlaylist = (index) => {
  return {
    type: ACTION_TYPES.removeItemFromPlaylist,
    index,
  };
};

const setIsPlaying = (isPlaying) => {
  return {
    type: ACTION_TYPES.setIsPlaying,
    isPlaying,
  };
};
const previousSong = () => {
  return {
    type: ACTION_TYPES.previousSong,
  };
};
const nextSong = () => {
  return {
    type: ACTION_TYPES.nextSong,
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

const requestPlaylist = () => {
  return {
    type: ACTION_TYPES.requestPlaylist,
  };
};
const updatePlaylist = (items) => {
  return {
    type: ACTION_TYPES.updatePlaylist,
    items,
  };
};

/** Async actions **/
const fetchSearchResults = () => {
  return (dispatch, getState) => {
    dispatch(requestSearchResults());
    return gapi.client.request({
      "path": "https://www.googleapis.com/youtube/v3/search",
      "params": {
        "part": "snippet",
        "q": getState().searchQuery,
        "maxResults": 10,
        "type": "video",
      },
    }).then((response) => {
      const mapped = response.result.items.map((item) => {
        return {
          ...item,
          id: item.id.videoId,
        };
      });
      dispatch(updateSearchResults(mapped));
    }, (reason) => {
      console.log(reason);
    });
  };
};
const fetchPlaylist = (videoIds) => {
  return (dispatch) => {
    dispatch(requestPlaylist());
    gapi.client.request({
      "path": "https://www.googleapis.com/youtube/v3/videos",
      "params": {
        "part": "snippet",
        "id": videoIds.join(","),
      },
    }).then((response) => {
      // Get audio URLs for items
      return Promise.all(response.result.items.map((item) => {
        return fetch(`http://localhost:8000/getAudioUrl?videoId=${item.id}`).then(
          response => response.json(),
          error => console.log("Error fetching audio", error)
        ).then((audio) => {
          return {
            ...item,
            playCount: 0,
            audio: {
              url: audio.url,
              duration: parseInt(audio.duration),
            },
          };
        });
      }));
    }, (error) => {
      console.log(error);
    }).then((items) => {
      dispatch(updatePlaylist(items));
    });
  };
};
const moveItemToPlaylist = (index) => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(requestPlaylist());

    const newItem = state.searchResults.results[index];
    const newSearchResults = state.searchResults.results.slice();
    newSearchResults.splice(index, 1);
    dispatch(updateSearchResults(newSearchResults));

    return fetch(`http://localhost:8000/getAudioUrl?videoId=${newItem.id}`).then(
      response => response.json(),
      error => console.log("Error fetching audio", error)
    ).then((json) => {
      const playlistItem = {
        ...newItem,
        playCount: 0,
        audio: {
          url: json.url,
          duration: parseInt(json.duration),
        },
      };
      dispatch(updatePlaylist(state.playlist.items.concat(playlistItem)));
    });
  };
};

const actions = {
  // Sync
  setSearchQuery,
  toggleRepeat,
  toggleShuffle,
  updateVolume,
  updateCurrentTime,
  mergeState,
  removeItemFromPlaylist,

  // Player
  setIsPlaying,
  previousSong,
  nextSong,

  // Async
  fetchSearchResults,
  fetchPlaylist,
  moveItemToPlaylist,
};
export default actions;
