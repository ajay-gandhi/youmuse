import { ACTION_TYPES, INITIAL_STATE, REPEAT_STATE } from "./constants";

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPES.setSearchQuery:
      return {
        ...state,
        searchQuery: action.searchQuery,
      };

    case ACTION_TYPES.toggleRepeat: {
      let repeat = state.repeat === REPEAT_STATE.off
        ? REPEAT_STATE.all
        : (state.repeat === REPEAT_STATE.all ? REPEAT_STATE.one : REPEAT_STATE.off);
      return {
        ...state,
        repeat,
      };
    }

    case ACTION_TYPES.toggleShuffle:
      return {
        ...state,
        shuffle: !state.shuffle
      };

    case ACTION_TYPES.moveToPlaylist: {
      const newItem = state.searchResults.results[action.index];
      const newSearchResults = state.searchResults.results.slice();
      newSearchResults.splice(action.index, 1);

      return {
        ...state,
        playlist: state.playlist.slice().concat(newItem),
        searchResults: {
          isFetching: false,
          results: newSearchResults,
        },
      };
    }

    case ACTION_TYPES.removeItemFromPlaylist: {
      const newPlaylist = state.playlist.slice();
      newPlaylist.splice(action.index, 1);
      return {
        ...state,
        playlist: newPlaylist,
      };
    }

    case ACTION_TYPES.mergeState:
      return {
        ...state,
        ...action.newState,
      };

    default:
      return state;
  }
};

export default reducer;
