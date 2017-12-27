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

const removeFromSearchResults = (index) => {
  return {
    type: ACTION_TYPES.removeFromSearchResults,
    index,
  };
};
const removeFromQueueByIndex = (index) => {
  return {
    type: ACTION_TYPES.removeFromQueueByIndex,
    index,
  };
};
const movePlaylistItem = (source, dest) => {
  return {
    type: ACTION_TYPES.movePlaylistItem,
    source,
    dest,
  };
};
const moveQueueItem = (source, dest) => {
  return {
    type: ACTION_TYPES.moveQueueItem,
    source,
    dest,
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
const doneRequestingPlaylist = () => {
  return {
    type: ACTION_TYPES.doneRequestingPlaylist,
  };
};
const addToPlaylist = (item, index) => {
  return {
    type: ACTION_TYPES.addToPlaylist,
    item,
    index,
  };
};
const removeFromPlaylistByIndex = (index) => {
  return {
    type: ACTION_TYPES.removeFromPlaylistByIndex,
    index,
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
      const mapped = response.result.items.map(item => ({
        ...item,
        id: item.id.videoId,
      }));
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
        return fetch(`/getAudioUrl/${item.id}`).then(
          response => response.json(),
          error => console.log("Error fetching audio", error)
        ).then((audio) => {
          return {
            ...item,
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
      // Add to playlist in order
      items.forEach((item, i) => dispatch(addToPlaylist(item, i)));
      dispatch(doneRequestingPlaylist());
    });
  };
};
const addItemToPlaylist = (item) => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(requestPlaylist());

    return fetch(`/getAudioUrl/${item.id}`).then(
      response => response.json(),
      error => console.log("Error fetching audio", error)
    ).then((json) => {
      const playlistItem = {
        ...item,
        audio: {
          url: json.url,
          duration: parseInt(json.duration),
        },
      };
      dispatch(addToPlaylist(playlistItem, state.playlist.items.length));
      dispatch(doneRequestingPlaylist());
    });
  };
};

const actions = {
  // Sync
  setSearchQuery,
  mergeState,
  removeFromSearchResults,
  removeFromQueueByIndex,
  removeFromPlaylistByIndex,
  movePlaylistItem,
  moveQueueItem,

  // Player
  setIsPlaying,
  previousSong,
  nextSong,
  toggleRepeat,
  toggleShuffle,
  updateVolume,
  updateCurrentTime,

  // Async
  fetchSearchResults,
  fetchPlaylist,
  addItemToPlaylist,
};
export default actions;
