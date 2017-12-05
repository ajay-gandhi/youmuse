export const REPEAT_STATE = Object.freeze({
  off: 0,
  all: 1,
  one: 2,
});

export const ACTION_TYPES = Object.freeze({
  search: "SEARCH",
  setSearchQuery: "SET_SEARCH_QUERY",
  toggleRepeat: "TOGGLE_REPEAT",
  toggleShuffle: "TOGGLE_SHUFFLE",
  mergeState: "MERGE_STATE",
  moveToPlaylist: "MOVE_TO_PLAYLIST",
  removeItemFromPlaylist: "REMOVE_ITEM_FROM_PLAYLIST",
});

export const INITIAL_STATE = Object.freeze({
  searchQuery: "",
  repeat: REPEAT_STATE.off,
  shuffle: false,
  playlist: [],
  queue: [],
  searchResults: {
    isFetching: false,
    results: [],
  },
});
