import { ACTION_TYPES, INITIAL_STATE, REPEAT_STATE } from "./Constants";
import {
  MAX_QUEUE_SIZE,
  createQueue,
  refillQueue,
  removeFromQueue,
  copyArray
} from "./QueueUtils";

// Reducer
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
        ...createQueue(state.playlist, state.currentSong, state.shuffle, repeat, state.queue),
      };
    }

    case ACTION_TYPES.toggleShuffle:
      return {
        ...state,
        shuffle: !state.shuffle,
        ...createQueue(state.playlist, state.currentSong, state.shuffle, state.repeat, state.queue),
      };

    case ACTION_TYPES.setIsPlaying:
      return {
        ...state,
        isPlaying: typeof action.isPlaying === "undefined" ? !state.isPlaying : action.isPlaying,
      };

    case ACTION_TYPES.previousSong: {
      const previousSong = state.playHistory[state.playHistory.length - 1];
      if (previousSong) {
        let playlist = state.playlist;
        let queue = copyArray(state.queue);
        if (state.currentSong) {
          queue.unshift(state.currentSong);
          if (queue.length > MAX_QUEUE_SIZE) {
            ({ playlist, queue } = removeFromQueue(playlist, queue, queue.length - 1));
          }
        }
        const currentSong = { ...previousSong };
        const playHistory = state.playHistory.slice(0, state.playHistory.length - 1);

        return {
          ...state,
          playHistory,
          currentSong,
          ...refillQueue(state.playlist, queue, currentSong, state.shuffle, state.repeat),
        };
      } else if (state.currentSong) {
        let playlist = state.playlist;
        let queue = copyArray(state.playHistory);
        queue.unshift(state.currentSong);
        if (queue.length > MAX_QUEUE_SIZE) {
          ({ playlist, queue } = removeFromQueue(playlist, queue, queue.length - 1));
        }
        const currentSong = null;

        return {
          ...state,
          isPlaying: false,
          queue,
          currentSong,
        };
      } else {
        return state;
      }
    }

    case ACTION_TYPES.nextSong: {
      const nextSong = state.queue[0];
      if (nextSong) {
        const playHistory = copyArray(state.playHistory);
        if (state.currentSong) playHistory.push(state.currentSong);
        const currentSong = { ...nextSong };
        const queue = copyArray(state.queue).slice(1);

        return {
          ...state,
          playHistory,
          currentSong,
          ...refillQueue(state.playlist, queue, currentSong, state.shuffle, state.repeat),
        };
      } else if (state.currentSong) {
        const playHistory = copyArray(state.playHistory);
        playHistory.push(state.currentSong);
        const currentSong = null;

        return {
          ...state,
          isPlaying: false,
          playHistory,
          currentSong,
        };
      } else {
        return state;
      }
    }

    case ACTION_TYPES.removeItemFromPlaylist: {
      // Deep copy
      const items = copyArray(state.playlist.items);
      const removed = items.splice(action.index, 1)[0];
      const queue = state.queue.filter(item => item.id === removed.id);
      const refilled = refillQueue(items, queue, state.currentSong, state.shuffle, state.repeat);

      return {
        ...state,
        ...refilled,
      };
    }

    case ACTION_TYPES.requestPlaylist:
      return {
        ...state,
        playlist: {
          isFetching: true,
          round: state.playlist.round,
          items: state.playlist.items,
        },
      };

    case ACTION_TYPES.updatePlaylist: {
      const playlist = {
        isFetching: false,
        round: state.playlist.round,
        items: action.items,
      };
      const refilled = refillQueue(playlist, state.queue, state.currentSong, state.shuffle, state.repeat);

      return {
        ...state,
        ...refilled,
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