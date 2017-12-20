export const REPEAT_STATE = Object.freeze({
  off: 0,
  all: 1,
  one: 2,
});

export const ACTION_TYPES = Object.freeze({
  setSearchQuery: "SET_SEARCH_QUERY",
  toggleRepeat: "TOGGLE_REPEAT",
  toggleShuffle: "TOGGLE_SHUFFLE",
  mergeState: "MERGE_STATE",

  setIsPlaying: "SET_IS_PLAYING",
  previousSong: "PREVIOUS_SONG",
  nextSong: "NEXT_SONG",

  requestPlaylist: "REQUEST_PLAYLIST",
  updatePlaylist: "UPDATE_PLAYLIST",
  removeItemFromPlaylist: "REMOVE_ITEM_FROM_PLAYLIST",
});

export const INITIAL_STATE = Object.freeze({
  searchQuery: "",
  repeat: REPEAT_STATE.off,
  shuffle: false,
  isPlaying: false,
  queue: [],
  playHistory: [],
  playlist: {
    isFetching: false,
    round: 0,
    items: [],
  },
  searchResults: {
    isFetching: false,
    results: [],
  },
});
