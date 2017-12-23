export const REPEAT_STATE = Object.freeze({
  off: 0,
  all: 1,
  one: 2,
});

export const ACTION_TYPES = Object.freeze({
  setSearchQuery: "SET_SEARCH_QUERY",
  toggleRepeat: "TOGGLE_REPEAT",
  toggleShuffle: "TOGGLE_SHUFFLE",
  updateVolume: "UPDATE_VOLUME",
  updateCurrentTime: "UPDATE_CURRENT_TIME",
  mergeState: "MERGE_STATE",

  setIsPlaying: "SET_IS_PLAYING",
  previousSong: "PREVIOUS_SONG",
  nextSong: "NEXT_SONG",

  requestPlaylist: "REQUEST_PLAYLIST",
  doneRequestingPlaylist: "DONE_REQUESTING_PLAYLIST",
  addToPlaylist: "ADD_TO_PLAYLIST",
  removeFromPlaylist: "REMOVE_FROM_PLAYLIST",
});

export const INITIAL_STATE = Object.freeze({
  searchQuery: "",
  repeat: REPEAT_STATE.off,
  shuffle: false,
  volume: 1.0,
  currentTime: 0.0,
  isPlaying: false,
  queue: [],
  playHistory: [],
  playlist: {
    isFetching: 0,
    round: 0,
    items: [],
  },
  searchResults: {
    isFetching: false,
    results: [],
  },
});
