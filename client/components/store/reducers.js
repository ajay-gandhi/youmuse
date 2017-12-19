import { ACTION_TYPES, INITIAL_STATE, REPEAT_STATE } from "./constants";

/*
const MAX_QUEUE_SIZE = 20;
const buildQueue = (playlist, currentSong, shuffle, repeat) => {
  if (repeat === REPEAT_STATE.one) return Array(MAX_QUEUE_SIZE).fill(currentSong);

  let queue = playlist.slice(0, MAX_QUEUE_SIZE);
  if (repeat === REPEAT_STATE.all && queue.length < MAX_QUEUE_SIZE) {
    const numExtraItems = queue.length - MAX_QUEUE_SIZE;
    queue = queue.concat(playlist.slice(0, numExtraItems));
  }

  if (shuffle) {
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = queue[i];
      queue[i] = queue[j];
      queue[j] = temp;
    }
  }

  return queue;
};
*/

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

    case ACTION_TYPES.removeItemFromPlaylist: {
      const items = state.playlist.items.slice();
      items.splice(action.index, 1);
      return {
        ...state,
        playlist: {
          isFetching: state.playlist.isFetching,
          items,
        },
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
